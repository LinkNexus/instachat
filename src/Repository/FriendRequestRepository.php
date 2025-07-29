<?php

namespace App\Repository;

use App\Entity\FriendRequest;
use App\Enum\FriendRequestStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Query\Parameter;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FriendRequest>
 */
class FriendRequestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FriendRequest::class);
    }

    /**
     * Finds an existing friend request between two users.
     *
     * @param int $requesterId The ID of the user who sent the request.
     * @param int $targetUserId The ID of the user who received the request.
     * @return ?FriendRequest Returns the existing FriendRequest or null if not found.
     */
    public function findExistingRequest(
        int $requesterId,
        int $targetUserId
    ): ?FriendRequest
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.requester = :requesterId OR f.targetUser = :requesterId')
            ->andWhere('f.targetUser = :targetUserId OR f.requester = :targetUserId')
            ->setParameters(new ArrayCollection([
                new Parameter('requesterId', $requesterId),
                new Parameter('targetUserId', $targetUserId),
            ]))
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAcceptedRequests(
        $userId,
        int $offset = 0,
        int $limit = 10
    ): array
    {
        $qb = $this->createQueryBuilder('f');
        $params = new ArrayCollection([
            new Parameter('status', FriendRequestStatus::ACCEPTED),
            new Parameter('userId', $userId),
        ]);

        $count = $qb
            ->select('COUNT(f.id)')
            ->andWhere("f.status = :status AND (f.requester = :userId OR f.targetUser = :userId)")
            ->setParameters($params)
            ->getQuery()
            ->getSingleScalarResult();

        $results = $qb
            ->select("f")
            ->andWhere("f.status = :status AND (f.requester = :userId OR f.targetUser = :userId)")
            ->setParameters($params)
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->orderBy('f.createdAt', 'DESC')
            ->getQuery()
            ->getResult();

        return [
            "count" => (int)$count,
            "results" => $results
        ];
    }

    //    /**
    //     * @return FriendRequest[] Returns an array of FriendRequest objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?FriendRequest
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
