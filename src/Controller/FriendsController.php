<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route("/api/friends", name: "api.friends.", format: "json")]
final class FriendsController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

    #[Route('', name: 'list', methods: ["GET"])]
    public function listFriends(
        #[CurrentUser] User      $user,
        #[MapQueryParameter] int $offset
    ): Response
    {
        return $this->json(
            $this->entityManager->getRepository(User::class)
                ->findFriendsPaginated($user->getId(), $offset),
            context: ["groups" => ["users:read"]]
        );
    }
}
