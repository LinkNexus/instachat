<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

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
                    "partner" => $chat,
                    "unreadCount" => $messageRepository->findUnreadMessagesCount($user->getId(), $chat->getId()),
                    ...$messageRepository->findAllByConversation($user->getId(), $chat->getId())
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
    public function listContacts(): JsonResponse
    {
        $friends = $this->entityManager->getRepository(User::class)
            ->findAll();

        return $this->json([
            "friends" => $friends
        ], context: ["groups" => ["users:read"]]);
    }

    #[Route("/friends/{id}", name: "get.personal", requirements: ["id" => Requirement::DIGITS], methods: ["GET"])]
    public function getPersonalConversation(
        #[CurrentUser] User $user,
        User $partner
    ): JsonResponse
    {
        $result = $this->entityManager->getRepository(Message::class)
            ->findAllByConversation($user->getId(), $partner->getId());

        return $this->json(
            [
                "partner" => $partner,
                "unreadCount" => $this->entityManager->getRepository(Message::class)
                    ->findUnreadMessagesCount($user->getId(), $partner->getId()),
                ...$result
            ],
            context: ["groups" => ["messages:read"]]
        );
    }
}
