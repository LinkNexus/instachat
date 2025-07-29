<?php

namespace App\Repository;

use App\Entity\Message;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    private ManagerRegistry $managerRegistry;

    public function __construct(
        ManagerRegistry $registry, ManagerRegistry $managerRegistry
    )
    {
        parent::__construct($registry, User::class);
        $this->managerRegistry = $managerRegistry;
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findOneByIdentifier(string $identifier): ?User
    {
        return $this->createQueryBuilder("u")
            ->where("u.email = :identifier OR u.username = :identifier")
            ->setParameter("identifier", $identifier)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Finds all users with whom the given user has exchanged messages.
     *
     * @param int $userId The ID of the user for whom to find chat partners.
     * @return User[] An array of User objects representing chat partners ordered by most recent message.
     */
    public function findChats(int $userId, int $offset, int $limit = 10): array
    {
        // Returns the list of users with whom the current user ($userId) has at least one message exchanged
        // ordered by the most recent message timestamp
        $qb = $this->createQueryBuilder('u1');

        $qb->select('DISTINCT u2.id, MAX(m.createdAt) as lastMessageTime')
            ->innerJoin(User::class, 'u2', 'WITH', 'u2.id != u1.id')
            ->innerJoin(
                Message::class,
                'm',
                'WITH',
                $qb->expr()->orX(
                    $qb->expr()->andX('m.sender = u1.id', 'm.receiver = u2.id'),
                    $qb->expr()->andX('m.sender = u2.id', 'm.receiver = u1.id')
                )
            )
            ->where('u1.id = :userId')
            ->setParameter('userId', $userId)
            ->groupBy('u2.id')
            ->orderBy('lastMessageTime', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        $results = $qb->getQuery()->getScalarResult();
        if (empty($results)) {
            return [];
        }

        $userIds = array_column($results, 'id');

        // Get the users in the same order as the sorted results
        $users = $this->createQueryBuilder('u')
            ->where('u.id IN (:ids)')
            ->setParameter('ids', $userIds)
            ->getQuery()
            ->getResult();

        // Reorder users according to the original sort order
        $orderedUsers = [];
        foreach ($userIds as $id) {
            foreach ($users as $user) {
                if ($user->getId() === (int)$id) {
                    $orderedUsers[] = $user;
                    break;
                }
            }
        }

        return $orderedUsers;
    }

    /**
     * Finds users by a search query with pagination.
     *
     * @param string $query The search query to match against usernames or names.
     * @param int $offset The offset for pagination.
     * @param int $limit The maximum number of results to return.
     * @return array{count: int, results: User[]} An array containing the count of matching users and the results.
     */
    public function findByQuery(string $query, int $offset, int $limit = 10): array
    {
        $countQb = $this->createQueryBuilder('u');
        $count = $countQb->select('COUNT(u.id)')
            ->where('u.username LIKE :query OR u.name LIKE :query')
            ->setParameter('query', "%$query%")
            ->getQuery()
            ->getSingleScalarResult();

        $qb = $this->createQueryBuilder('u');
        $results = $qb->select('u')
            ->where('u.username LIKE :query OR u.name LIKE :query')
            ->setParameter('query', "%$query%")
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return [
            "count" => (int)$count,
            "results" => $results
        ];
    }

    //    /**
    //     * @return User[] Returns an array of User objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?User
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
