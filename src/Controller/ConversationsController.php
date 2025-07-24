<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route("/api/conversations", name: "api.conversations.", priority: 5, format: "json")]
#[IsGranted("IS_AUTHENTICATED")]
final class ConversationsController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

    #[Route("", name: "list", methods: ["GET"])]
    public function listConversations(
        #[CurrentUser]           $user,
        MessageRepository        $messageRepository,
        #[MapQueryParameter] int $offset = 0
    ): JsonResponse
    {
        $chats = $this->entityManager->getRepository(User::class)
            ->findChats($user->getId(), $offset);

        return $this->json(
            array_map(static function ($chat) use ($user, $messageRepository) {
                return [
                    "user" => $chat,
                    "messages" => $messageRepository->findAllByConversation($user->getId(), $chat->getId()),
                    "unreadCount" => $messageRepository->findUnreadMessagesCount($user->getId(), $chat->getId()),
                ];
            },
                $chats
            ),
            context: [
                "groups" => [
                    "messages:read"
                ]
            ]
        );
    }

    #[Route("/contacts", name: "list.contacts", methods: ["GET"])]
    public function newConversation(): JsonResponse
    {
        $friends = $this->entityManager->getRepository(User::class)
            ->findAll();

        return $this->json([
            "friends" => $friends
        ], context: ["groups" => ["users:read"]]);
    }

    #[Route("/messages/{id}", name: "messages", requirements: ["id" => Requirement::DIGITS], methods: ["GET"])]
    public function getMessages(
        User                     $partner,
        #[CurrentUser]           $user,
        #[MapQueryParameter] int $offset = 0
    ): JsonResponse
    {
        $messages = $this->entityManager->getRepository(Message::class)
            ->findAllByConversation($user->getId(), $partner->getId(), $offset);

        return $this->json($messages, context: ["groups" => ["messages:read"]]);
    }

    #[Route("/{id}", name: "get", requirements: ["id" => Requirement::DIGITS], methods: ["GET"])]
    public function getConversation(
        User                $partner,
        #[CurrentUser] User $user
    ): JsonResponse
    {
        return $this->json(
            [
                "user" => $partner,
                "messages" => $this->entityManager->getRepository(Message::class)
                    ->findAllByConversation($user->getId(), $partner->getId()),
                "unreadCount" => $this->entityManager->getRepository(Message::class)
                    ->findUnreadMessagesCount($user->getId(), $partner->getId()),
            ],
            context: ["groups" => ["messages:read"]]
        );
    }

    #[Route("/send-message/{id}", name: "send_message", requirements: ["id" => Requirement::DIGITS], methods: ["POST"])]
    public function sendMessage(
        #[MapRequestPayload] Message $message,
        #[CurrentUser] User          $user,
        User                         $partner,
        HubInterface                 $hub,
        SerializerInterface          $serializer
    ): JsonResponse
    {
        $message->setSender($user);
        $message->setReceiver($partner);

        $this->entityManager->persist($message);
        $this->entityManager->flush();

        $hub->publish(
            new Update(
                "https://example.com/messages/{$partner->getId()}",
                $serializer->serialize(
                    $message,
                    "json",
                    context: ["groups" => ["messages:read"]]
                ),
                true
            ),
        );

        return $this->json($message, context: ["groups" => ["messages:read"]]);
    }
}
