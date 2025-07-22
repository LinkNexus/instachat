<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route("/api/chat", name: "api.chat.", priority: 5, format: "json")]
#[IsGranted("IS_AUTHENTICATED")]
final class ChatController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

//    public function listChats(): Response
//    {
//
//    }

    #[Route("/list", name: "list_chats", methods: ["GET"])]
    public function listChats(#[CurrentUser] $user): JsonResponse
    {
        $chats = $this->entityManager->getRepository(User::class)
            ->findChats($user->getId());

        return $this->json(
            array_map(function ($chat) use ($user) {
                return [
                    "user" => $chat,
                    "unreadCount" => $this->entityManager->getRepository(Message::class)
                        ->findUnreadMessagesCount($user->getId(), $chat->getId()),
                    "lastMessage" => $this->entityManager->getRepository(Message::class)
                        ->findLastMessage($user->getId(), $chat->getId())
                ];
            },
                $chats
            ),
            context: [
                "groups" => [
                    "users:read",
                    "messages:read"
                ]
            ]
        );
    }

    #[Route("/new", name: "new_conversation", methods: ["GET", "POST"])]
    public function newConversation(): JsonResponse
    {
        $friends = $this->entityManager->getRepository(User::class)
            ->findAll();

        return $this->json([
            "friends" => $friends
        ], context: ["groups" => ["users:read"]]);
    }

    #[Route("/messages", name: "get_messages", methods: ["GET"])]
    public function getMessages(
        #[MapQueryParameter] int $partnerId,
        #[CurrentUser]           $user,
        #[MapQueryParameter] int $offset = 0
    ): JsonResponse
    {
        $messages = $this->entityManager->getRepository(Message::class)
            ->findAllByConversation($user->getId(), $partnerId, $offset);

        return $this->json($messages, context: ["groups" => ["messages:read"]]);
    }

    #[Route("/conversation", name: "get_conversation", methods: ["GET"])]
    public function getConversation(
        #[MapQueryParameter] string $partnerUsername,
        #[CurrentUser] User         $user
    ): JsonResponse
    {
        $partner = $this->entityManager->getRepository(User::class)
            ->findOneByIdentifier($partnerUsername);

        if (!$partner) {
            throw $this->createNotFoundException("The user with this username was not found");
        }

        $messages = $this->entityManager->getRepository(Message::class)
            ->findAllByConversation($user->getId(), $partner->getId());

        return $this->json([
            "user" => $partner,
            "messages" => $messages
        ], context: ["groups" => [
            "users:read",
            "messages:read"
        ]]);
    }

    #[Route("/send-message", name: "send_message", methods: ["POST"])]
    public function sendMessage(
        #[MapRequestPayload] Message $message,
        #[CurrentUser] User          $user,
        #[MapQueryParameter] int     $partnerId
    ): JsonResponse
    {
        $partner = $this->entityManager->getRepository(User::class)
            ->find($partnerId);

        if (!$partner) {
            throw $this->createNotFoundException("The user with this id was not found");
        }

        $message->setSender($user);
        $message->setReceiver($partner);

        $this->entityManager->persist($message);
        $this->entityManager->flush();

        return $this->json($message, context: ["groups" => ["messages:read"]]);
    }
}
