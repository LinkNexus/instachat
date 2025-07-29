<?php

namespace App\DataFixtures;

use App\Entity\User;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

class UsersFixtures extends Fixture
{

    public const MAIN_USER_REFERENCE = 'main_user';

    public function __construct(
        private readonly UserPasswordHasherInterface $userPasswordHasher,
        private readonly SluggerInterface $slugger
    )
    {
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        for ($i = 0; $i < 50; $i++) {
            $user = new User();
            $user->setName($faker->name)
                ->setEmail($faker->email)
                ->setUsername($this->slugger->slug($user->getName()))
                ->setPassword($this->userPasswordHasher->hashPassword($user, "test"))
                ->setIsVerified($faker->boolean(80))
                ->setJoinedAt(DateTimeImmutable::createFromMutable(
                    $faker->dateTimeBetween('-1 years')
                ));

            $manager->persist($user);
        }

        $user = new User();
        $user->setName("John Doe")
            ->setEmail("john@doe.com")
            ->setUsername("john_doe")
            ->setPassword($this->userPasswordHasher->hashPassword($user, "test"))
            ->setIsVerified(true);

        $manager->persist($user);
        $manager->flush();

        $this->addReference(self::MAIN_USER_REFERENCE, $user);
    }
}
