<?php

namespace App\DataFixtures;

use App\Entity\Message;
use App\Entity\User;
use DateInterval;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class MessagesFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $mainUser = $this->getReference(UsersFixtures::MAIN_USER_REFERENCE, User::class);

        /** @var User[] $users */
        $users = $manager->getRepository(User::class)
            ->createQueryBuilder("u")
            ->where("u.id != :id")
            ->setParameter("id", $mainUser->getId())
            ->getQuery()
            ->getResult();

        $faker = Factory::create();

        foreach ($users as $user) {
            foreach (range(20, 50) as $i) {
                $sender = $faker->boolean(50) ? $mainUser : $user;
                $message = new Message();
                $message->setContent($faker->realText(300))
                    ->setCreatedAt(DateTimeImmutable::createFromMutable(
                        $faker->dateTimeBetween('-1 years')
                    ))
                    ->setSender($sender)
                    ->setReceiver($sender->getId() === $mainUser->getId() ? $user : $mainUser)
                    ->setReadAt($faker->boolean() ? null :
                        $message->getCreatedAt()->add(new DateInterval("P3M"))
                    )
                    ->setModifiedAt($message->getCreatedAt());

                $manager->persist($message);
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UsersFixtures::class,
        ];
    }
}
