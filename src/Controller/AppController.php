<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AppController extends AbstractController
{
    #[Route(path: "/api/flash-messages", name: "flash_messages", methods: ["GET"])]
    public function flashMessages(Request $request): JsonResponse
    {
        return $this->json($request->getSession()->getFlashBag()->all());
    }

    #[Route('/{url}', name: 'index', requirements: ["url" => "^((?!api).)*$"])]
    public function index(): Response
    {
        return $this->render('app/index.html.twig');
    }
}
