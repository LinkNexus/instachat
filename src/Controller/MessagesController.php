<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Enum\MessageEventType;
use App\Event\MessageEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route("/api/messages", name: "api.messages.", format: "json")]
#[IsGranted("IS_AUTHENTICATED")]
final class MessagesController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly EventDispatcherInterface $eventDispatcher,
    )
    {
    }

    #[Route("", name: "create", requirements: ["id" => Requirement::DIGITS], methods: ["POST"])]
    public function create(
        #[MapRequestPayload] Message $message,
        #[CurrentUser] User          $user,
        #[MapQueryParameter] ?int    $partnerId,
    ): JsonResponse
    {
        $partner = $this->entityManager->getRepository(User::class)->find($partnerId);

        if (!$partner) {
            throw $this->createNotFoundException("The user was not found.");
        }

        $message->setSender($user);
        $message->setReceiver($partner);

        $this->entityManager->persist($message);
        $this->entityManager->flush();

        $this->eventDispatcher->dispatch(new MessageEvent($message, MessageEventType::CREATED));

        return $this->json($message, context: ["groups" => ["messages:read"]]);
    }

    #[Route("", name: "list", methods: ["GET"])]
    public function listMessages(
        #[CurrentUser] User      $user,
        #[MapQueryParameter] int $partnerId,
        #[MapQueryParameter] int $offset = 0
    ): JsonResponse
    {
        $partner = $this->entityManager->getRepository(User::class)->find($partnerId);

        if (!$partner) {
            throw $this->createNotFoundException("The user was not found.");
        }

        $messages = $this->entityManager->getRepository(Message::class)
            ->findAllByConversation($user->getId(), $partner->getId(), $offset)["messages"];

        return $this->json(
            $messages,
            context: ["groups" => ["messages:read"]]
        );
    }

    #[Route("/read", name: "read")]
    public function read(
        #[CurrentUser] User $user,
        #[MapQueryParameter] ?int $partnerId,
        HubInterface $hub
    ): JsonResponse
    {
        $partner = $this->entityManager->getRepository(User::class)->find($partnerId);

        if (!$partner) {
            throw $this->createNotFoundException("The user was not found.");
        }

        $this->entityManager->getRepository(Message::class)
            ->readMessages($user->getId(), $partner->getId());

        $hub->publish(new Update(
            "https://example.com/read-messages/{$partner->getId()}",
            json_encode([
                "partnerId" => $user->getId(),
            ], JSON_THROW_ON_ERROR)
        ));

        return $this->json(null, status: 204);
    }

    #[Route("/{id}", name: "delete", requirements: ["id" => Requirement::DIGITS], methods: ["DELETE"])]
    public function delete(Message $message): JsonResponse
    {
        $this->entityManager->remove($message);
        $this->entityManager->flush();

        return $this->json(null, status: 204);
    }
}
