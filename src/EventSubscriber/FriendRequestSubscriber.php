<?php

namespace App\EventSubscriber;

use App\Event\FriendRequestEvent;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\SerializerInterface;

readonly class FriendRequestSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private HubInterface        $hub,
        private SerializerInterface $serializer,
        private Security            $security
    )
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            FriendRequestEvent::class => 'dispatchRequest',
        ];
    }

    public function dispatchRequest(FriendRequestEvent $event): void
    {
        $this->hub->publish(
            new Update(
                "https://example.com/friend-requests/{$this->security->getUser()->getId()}",
                $this->serializer->serialize(
                    [
                        "event" => $event->type->getName(),
                        "request" => $event->friendRequest
                    ],
                    "json",
                    context: ["groups" => ["friend_requests:read"]]
                )
            )
        );
    }
}
