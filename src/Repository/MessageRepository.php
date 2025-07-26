<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Query\Parameter;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    /**
     * @param int $senderId
     * @param int $receiverId
     * @param int $limit
     * @param int $offset
     * @return array Returns an array with 'messages' and 'total' keys
     */
    public function findAllByConversation(int $senderId, int $receiverId, int $offset = 0, int $limit = 10): array
    {
        $messages = array_reverse(
            $this->createQueryBuilder('m')
                ->where('(m.sender = :senderId AND m.receiver = :receiverId) OR (m.receiver = :senderId AND m.sender = :receiverId)')
                ->setParameters(new ArrayCollection([
                    new Parameter('senderId', $senderId),
                    new Parameter('receiverId', $receiverId)
                ]))
                ->setFirstResult($offset)
                ->orderBy('m.createdAt', 'DESC')
                ->setMaxResults($limit)
                ->getQuery()
                ->getResult()
        );

        return [
            'messages' => $messages,
            'count' => $this->findCount($senderId, $receiverId)
        ];
    }

    public function findCount(int $senderId, int $receiverId): int
    {
        return (int)$this->createQueryBuilder('m')
            ->select('COUNT(m.id)')
            ->where('(m.sender = :senderId AND m.receiver = :receiverId) OR (m.receiver = :senderId AND m.sender = :receiverId)')
            ->setParameters(new ArrayCollection([
                new Parameter('senderId', $senderId),
                new Parameter('receiverId', $receiverId)
            ]))
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findUnreadMessagesCount(int $currentUserId, int $receiverId): int
    {
        return (int)$this->createQueryBuilder('m')
            ->select('COUNT(m.id)')
            ->where('m.sender = :receiverId AND m.receiver = :currentUserId AND m.readAt is NULL')
            ->setParameters(new ArrayCollection([
                new Parameter('currentUserId', $currentUserId),
                new Parameter('receiverId', $receiverId)
            ]))
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function readMessages(int $currentUserId, int $receiverId): void
    {
        $this->createQueryBuilder('m')
            ->update()
            ->set('m.readAt', 'CURRENT_TIMESTAMP()')
            ->where('m.sender = :receiverId AND m.receiver = :currentUserId AND m.readAt is NULL')
            ->setParameters(new ArrayCollection([
                new Parameter('currentUserId', $currentUserId),
                new Parameter('receiverId', $receiverId)
            ]))
            ->getQuery()
            ->execute();
    }

    public function findLastMessage(int $senderId, int $receiverId): ?Message
    {
        return $this->createQueryBuilder('m')
            ->where('(m.sender = :senderId AND m.receiver = :receiverId) OR (m.receiver = :senderId AND m.sender = :receiverId)')
            ->setParameters(new ArrayCollection([
                new Parameter('senderId', $senderId),
                new Parameter('receiverId', $receiverId)
            ]))
            ->orderBy('m.createdAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    //    /**
    //     * @return MessageComponent[] Returns an array of MessageComponent objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?MessageComponent
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
