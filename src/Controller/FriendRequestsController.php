<?php

namespace App\Controller;

use App\Entity\FriendRequest;
use App\Entity\User;
use App\Enum\FriendRequestStatus;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route("/friends/requests", name: "app.friends.requests.", format: "json")]
final class FriendRequestsController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

    #[Route('', name: 'create', methods: ["POST"])]
    public function index(
        #[MapQueryParameter] int $targetUserId,
        #[CurrentUser] User $currentUser
    ): Response
    {
        $targetUser = $this->entityManager->getRepository(User::class)
            ->find($targetUserId);

        if (!$targetUser) {
            $this->createNotFoundException("The user was not found.");
        }

        $existingRequest = $this->entityManager->getRepository(FriendRequest::class)
            ->findExistingRequest($currentUser->getId(), $targetUser->getId());

        if (null !== $existingRequest) {
            if ($existingRequest->getStatus() === FriendRequestStatus::CANCELED) {
                $existingRequest->setCreatedAt(new DateTimeImmutable());
                $existingRequest->setStatus(FriendRequestStatus::PENDING);
            }
            $friendRequest = $existingRequest;
        } else {
            $friendRequest = new FriendRequest();
            $friendRequest->setRequester($currentUser);
            $friendRequest->setTargetUser($targetUser);
            $this->entityManager->persist($friendRequest);
        }

        $this->entityManager->flush();

        return $this->json(
            $friendRequest,
            context: ["groups" => ["friend_requests:read"]]
        );
    }
}
