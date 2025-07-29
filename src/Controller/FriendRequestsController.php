<?php

namespace App\Controller;

use App\Entity\FriendRequest;
use App\Entity\User;
use App\Enum\FriendRequestCategory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route("/api/friend-requests", name: "api.friends.", format: "json")]
final class FriendRequestsController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

    #[Route('', name: 'list', methods: ["GET"])]
    public function list(
        #[CurrentUser] User      $user,
        #[MapQueryParameter] FriendRequestCategory $category,
        #[MapQueryParameter] int $offset = 0
    ): Response
    {
        return $this->json(
            match ($category) {
                FriendRequestCategory::ACCEPTED =>
                    $this->entityManager->getRepository(FriendRequest::class)
                        ->findAcceptedRequests($user->getId(), $offset),
                FriendRequestCategory::PENDING, FriendRequestCategory::SENT => []
            },
            context: ["groups" => ["friend_requests:read"]]
        );
    }

    #[Route('', name: 'create', methods: ["POST"])]
    public function create(
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
            return $this->json([
                "message" => "You have already sent a friend request to this user.",
                "status" => $existingRequest->getStatus()
            ], Response::HTTP_CONFLICT);
        }

        $friendRequest = new FriendRequest();
        $friendRequest->setRequester($currentUser);
        $friendRequest->setTargetUser($targetUser);
        $this->entityManager->persist($friendRequest);

        $this->entityManager->flush();

        return $this->json(
            $friendRequest,
            context: ["groups" => ["friend_requests:read"]]
        );
    }
}
