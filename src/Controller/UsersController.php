<?php

namespace App\Controller;

use App\Entity\FriendRequest;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route("/api/users", name: "api.users.", format: "json")]
#[IsGranted("IS_AUTHENTICATED_FULLY", message: "Access denied. You need to be logged in to access this resource.")]
final class UsersController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

    #[Route("", name: "list", methods: ["GET"])]
    public function index(
        #[CurrentUser] User         $currentUser,
        #[MapQueryParameter] string $search = "",
        #[MapQueryParameter] int    $offset = 0,
    ): JsonResponse
    {
        $results = $this->entityManager->getRepository(User::class)
            ->findByQuery($search, $offset);

        return $this->json(
            [
                "results" => array_map(function (User $user) use ($currentUser) {
                    return [
                        "user" => $user,
                        "friendRequest" => $this->entityManager->getRepository(FriendRequest::class)
                            ->findExistingRequest($currentUser->getId(), $user->getId())
                    ];
                }, array_filter($results["results"], static fn(User $user) => $user->getId() !== $currentUser->getId())),
                "count" => $results["count"]
            ],
            context: ["groups" => ["friend_requests:read"]]
        );
    }
}
