<?php

namespace App\EventSubscriber;

use App\Event\SendVerificationEmailEvent;
use App\Security\EmailVerifier;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Mime\Address;

final readonly class SendVerificationEmailSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EmailVerifier $emailVerifier,
        private RequestStack  $requestStack,
    )
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            SendVerificationEmailSubscriber::class => "sendVerificationEmail"
        ];
    }

    public function sendVerificationEmail(SendVerificationEmailEvent $event): void
    {
        $user = $event->getUser();
        $this->emailVerifier->sendEmailConfirmation("auth.verify_email", $user, (new TemplatedEmail)
            ->to(new Address($user->getEmail(), $user->getName()))
            ->subject("Registration Confirmation to BlitzTask!")
            ->htmlTemplate("auth/registration_email.html.twig")
        );
        $this->requestStack->getSession()->getFlashBag()->add("success", "Please check your email to verify your account.");
    }
}
