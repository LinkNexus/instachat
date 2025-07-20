<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Event\SendVerificationEmailEvent;
use App\Security\EmailVerifier;
use App\Security\LoginFormAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use LogicException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;

#[Route(path: "/api/auth", name: "api.auth.", priority: 5)]
class SecurityController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface   $entityManager,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly EmailVerifier            $emailVerifier
    )
    {
    }

    #[Route(path: "/register", name: "register", methods: ["POST"])]
    public function register(
        #[MapRequestPayload] User $user,
        Security                  $security,
        UserPasswordHasherInterface $passwordHasher
    ): Response
    {
        if ($this->entityManager->getRepository(User::class)->findOneBy(['email' => $user->getEmail()])) {
            return $this->json([
                "violations" => [
                    [
                        "propertyPath" => "email",
                        "title" => "This email is already in use by another account."
                    ]
                ]
            ], Response::HTTP_BAD_REQUEST);
        }

        if ($this->entityManager->getRepository(User::class)->findOneBy(['username' => $user->getUsername()])) {
            return $this->json([
                "violations" => [
                    [
                        "propertyPath" => "username",
                        "title" => "The username {$user->getUsername()} is already in use by another account."
                    ]
                ]
            ], Response::HTTP_BAD_REQUEST);
        }

        $user->setPassword($passwordHasher->hashPassword($user, $user->getPassword()));
        $this->entityManager->persist($user->setIsVerified(false));
        $this->entityManager->flush();
        $this->entityManager->refresh($user);

        $this->eventDispatcher->dispatch(new SendVerificationEmailEvent($user));
        return $security->login($user, LoginFormAuthenticator::class, "main");
    }

    #[Route("/login", name: "login", methods: ["POST"])]
    public function login(): JsonResponse
    {
        throw new LogicException('This method can be blank - it will be intercepted by the login key on your firewall.');
    }

    #[Route("/resend-verification", name: "resend_verification", methods: ["POST"])]
    public function resendVerificationEmail(): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        /** @var User $user */
        $user = $this->getUser();
        if (!$user->isVerified()) {
            $this->eventDispatcher->dispatch(new SendVerificationEmailEvent($user));
        }

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout()
    {
        throw new LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route('/verify/email', name: 'verify_email')]
    public function verifyUserEmail(
        Request $request
    ): RedirectResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        try {
            /** @var User $user */
            $user = $this->getUser();
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('error', $exception->getMessage());
            return $this->redirect("/register");
        }

        $this->addFlash('success', 'Your email has been successfully verified.');
        return $this->redirect("/chat");
    }
}
