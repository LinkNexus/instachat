<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UsersFixtures extends Fixture
{

    public function __construct(private readonly UserPasswordHasherInterface $userPasswordHasher)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $user = new User();

        $user->setName("Admin User")
            ->setEmail("admin@test.com")
            ->setPassword($this->userPasswordHasher->hashPassword($user, "test"))
            ->setRoles(["ROLE_ADMIN"])
            ->setIsVerified(false);

        $manager->persist($user);
        $manager->flush();
    }
}
