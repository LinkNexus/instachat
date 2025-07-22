<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Factory\UserFactory;
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

        $user->setName("John Doe")
            ->setEmail("john@doe.com")
            ->setUsername("john_doe")
            ->setPassword($this->userPasswordHasher->hashPassword($user, "test"))
            ->setIsVerified(true);

        UserFactory::createMany(30);

        $manager->persist($user);
        $manager->flush();
    }
}
