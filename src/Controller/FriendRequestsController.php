<?php

namespace App\Controller;

use App\Entity\FriendRequest;
use App\Entity\User;
use App\Enum\FriendRequestCategory;
use App\Enum\FriendRequestEventType;
use App\Enum\FriendRequestStatus;
use App\Event\FriendRequestEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route("/api/friend-requests", name: "api.friends.", format: "json")]
#[IsGranted("IS_AUTHENTICATED_FULLY")]
final class FriendRequestsController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface   $entityManager,
        private readonly EventDispatcherInterface $dispatcher
    )
    {
    }

    #[Route('', name: 'list', methods: ["GET"])]
    public function list(
        #[CurrentUser] User                        $user,
        #[MapQueryParameter] FriendRequestCategory $category,
        #[MapQueryParameter] int                   $offset = 0
    ): Response
    {
        return $this->json(
            match ($category) {
                FriendRequestCategory::ACCEPTED =>
                $this->entityManager->getRepository(FriendRequest::class)
                    ->findAcceptedRequests($user->getId(), $offset),
                FriendRequestCategory::PENDING =>
                $this->entityManager->getRepository(FriendRequest::class)
                    ->findPendingRequests($user->getId(), $offset),
                FriendRequestCategory::SENT =>
                $this->entityManager->getRepository(FriendRequest::class)
                    ->findSentRequests($user->getId(), $offset),
            },
            context: ["groups" => ["friend_requests:read"]]
        );
    }

    #[Route('', name: 'create', methods: ["POST"])]
    public function create(
        #[MapQueryParameter] int $targetUserId,
        #[CurrentUser] User      $currentUser
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

        $this->dispatcher->dispatch(
            new FriendRequestEvent(
                $friendRequest,
                FriendRequestEventType::CREATED
            )
        );

        return $this->json(
            $friendRequest,
            context: ["groups" => ["friend_requests:read"]]
        );
    }

    #[Route('/count', name: 'count', methods: ["GET"])]
    public function getCount(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json($this->entityManager->getRepository(FriendRequest::class)
            ->findRequestsCounts($user->getId())
        );
    }

    #[Route('/{id}/accept', name: 'accept', methods: ["PUT"])]
    public function acceptRequest(
        FriendRequest       $friendRequest,
        #[CurrentUser] User $user
    ): JsonResponse
    {
        if ($user->getId() !== $friendRequest->getTargetUser()?->getId()) {
            return $this->json([
                "message" => "You are not authorized to accept this friend request."
            ], Response::HTTP_FORBIDDEN);
        }

        if ($friendRequest->getStatus() !== FriendRequestStatus::PENDING) {
            return $this->json([
                "message" => "This friend request is not pending."
            ], Response::HTTP_BAD_REQUEST);
        }

        $friendRequest->setStatus(FriendRequestStatus::ACCEPTED);
        $this->entityManager->flush();

        return $this->json(
            $friendRequest,
            context: ["groups" => ["friend_requests:read"]]
        );
    }
}
