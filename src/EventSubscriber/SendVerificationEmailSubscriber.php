<?php

namespace App\EventSubscriber;

use App\Event\SendVerificationEmailEvent;
use App\Security\EmailVerifier;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mime\Address;

final readonly class SendVerificationEmailSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EmailVerifier $emailVerifier,
    )
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            SendVerificationEmailEvent::class => "sendVerificationEmail"
        ];
    }

    public function sendVerificationEmail(SendVerificationEmailEvent $event): void
    {
        $user = $event->getUser();
        $this->emailVerifier->sendEmailConfirmation("api.auth.verify_email", $user, (new TemplatedEmail)
            ->to(new Address($user->getEmail(), $user->getName()))
            ->subject("Registration Confirmation to BlitzTask!")
            ->htmlTemplate("auth/registration_email.html.twig")
        );
    }
}
