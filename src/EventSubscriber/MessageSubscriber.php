<?php

namespace App\EventSubscriber;

use App\Event\MessageEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\SerializerInterface;

final readonly class MessageSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private HubInterface        $hub,
        private SerializerInterface $serializer,
    )
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            MessageEvent::class => 'dispatchMessage',
        ];
    }

    public function dispatchMessage(MessageEvent $event): void
    {
        if ($receiver = $event->message->getReceiver()) {
            $this->hub->publish(
                new Update(
                    "https://example.com/messages/{$receiver->getId()}",
                    $this->serializer->serialize(
                        [
                            "event" => $event->type->getName(),
                            "message" => $event->message
                        ],
                        "json",
                        context: ["groups" => ["messages:read"]]
                    ),
                    true
                ),
            );
        }
    }
}
