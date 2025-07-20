<?php

namespace App\Controller;

use App\DTO\ResetPasswordDTO;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\ResetPassword\Controller\ResetPasswordControllerTrait;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

#[Route('/api/auth/reset-password', name: 'api.auth.reset_password.')]
final class ResetPasswordController extends AbstractController
{

    use ResetPasswordControllerTrait;

    public function __construct(
        private readonly EntityManagerInterface       $entityManager,
        private readonly ResetPasswordHelperInterface $resetPasswordHelper,
        private readonly MailerInterface              $mailer
    )
    {
    }

    #[Route("", name: "request", methods: ["POST"])]
    public function request(Request $request): JsonResponse
    {
        $email = json_decode($request->getContent())->identifier;
        return $this->processSendingPasswordResetEmail($email);
    }

    private function processSendingPasswordResetEmail(string $identifier): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->findOneByIdentifier($identifier);

        // Do not reveal whether a user account was found or not.
        if (!$user) {
            return $this->json([
                "resetToken" => $this->resetPasswordHelper->generateFakeResetToken()
            ]);
        }

        try {
            $resetToken = $this->resetPasswordHelper->generateResetToken($user);
        } catch (ResetPasswordExceptionInterface $e) {
            return $this->json([
                "error" => sprintf(
                    '%s - %s',
                    ResetPasswordExceptionInterface::MESSAGE_PROBLEM_HANDLE,
                    $e->getReason()
                )
            ], Response::HTTP_BAD_REQUEST);
        }

        $email = new TemplatedEmail()
            ->to((string)$user->getEmail())
            ->subject('Your password reset request')
            ->htmlTemplate('auth/reset_password_email.html.twig')
            ->context([
                'resetToken' => $resetToken
            ]);

        $this->mailer->send($email);

        // Store the token object in session for retrieval in the check-email route.
        $this->setTokenObjectInSession($resetToken);

        return $this->json(null, Response::HTTP_OK);
    }

    #[Route('/store-token/{token}', name: 'store_token', methods: ['GET'])]
    public function storeResetToken(
        string $token
    ): Response
    {
        // We store the token in session and remove it from the URL, to avoid the URL being
        // loaded in a browser and potentially leaking the token to 3rd party JavaScript.
        $this->storeTokenInSession($token);
        return $this->redirect('/reset-password');
    }

    #[Route("/reset", name: "reset", methods: ["POST"])]
    public function reset(
        UserPasswordHasherInterface           $passwordHasher,
        #[MapRequestPayload] ResetPasswordDTO $passwordDTO,
    ): JsonResponse
    {
        $token = $this->getTokenFromSession();

        if (null === $token) {
            throw $this->createNotFoundException('No reset password token found in the URL or in the session.');
        }

        try {
            /** @var User $user */
            $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        } catch (ResetPasswordExceptionInterface $e) {
            return $this->json([
                "error" => sprintf(
                    '%s - %s',
                    ResetPasswordExceptionInterface::MESSAGE_PROBLEM_VALIDATE,
                    $e->getReason()
                )
            ]);
        }

        $this->resetPasswordHelper->removeResetRequest($token);
        $user->setPassword($passwordHasher->hashPassword($user, $passwordDTO->password));
        $this->entityManager->flush();

        $this->cleanSessionAfterReset();
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
