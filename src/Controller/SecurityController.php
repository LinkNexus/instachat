<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Event\LoginAttemptEvent;
use App\Event\SendVerificationEmailEvent;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use LogicException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;

#[Route(path: "/api/auth", name: "api.auth.")]
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
    ): Response
    {
        if ($this->entityManager->getRepository(User::class)->findOneBy(['email' => $user->getEmail()])) {
            return $this->json([
                "violations" => [
                    [
                        "propertyPath" => "email",
                        "title" => "The email {$user->getEmail()} is already in use by another account."
                    ]
                ]
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($user->setIsVerified(false));
        $this->entityManager->flush();
        $this->entityManager->refresh($user);

        $this->eventDispatcher->dispatch(new SendVerificationEmailEvent($user));
        return $security->login($user, "login_link", "main");
    }

    #[Route("/login", name: "login", methods: ["POST"])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if ($user) {
            $this->eventDispatcher->dispatch(new LoginAttemptEvent($user));
        }

        return $this->json(['status' => 'success'], Response::HTTP_OK);
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
    public function logout() {
        throw new LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route('/verify/email', name: 'verify_email')]
    public function verifyUserEmail(
        Request $request,
        #[Autowire('%env(CLIENT_URL)%')] string $domain
    ): RedirectResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        try {
            /** @var User $user */
            $user = $this->getUser();
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('error', $exception->getMessage());
            return $this->redirect("$domain/auth/register");
        }

        $this->addFlash('success', 'Your email has been successfully verified.');
        return $this->redirect($domain);
    }

    #[Route('/login_check', name: 'login_check')]
    public function check(Request $request): Response
    {
        return $this->redirect("/login-check?".
            http_build_query([
                "expires" => $request->query->get("expires"),
                "user" => $request->query->get("user"),
                "hash" => $request->query->get("hash"),
            ])
        );
    }
}
