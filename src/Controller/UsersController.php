<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;

#[Route("/api/users", name: "api.users.", format: "json")]
final class UsersController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

    #[Route("", name: "list", methods: ["GET"])]
    public function index(
        #[MapQueryParameter] string $search = "",
        #[MapQueryParameter] int    $offset = 0,
    ): JsonResponse
    {
        $users = $this->entityManager->getRepository(User::class)
            ->findByQuery($search, $offset);

        return $this->json($users, context: ["groups" => ["users:read"]]);
    }
}
