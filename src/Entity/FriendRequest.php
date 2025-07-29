<?php

namespace App\Entity;

use App\Enum\FriendRequestStatus;
use App\Repository\FriendRequestRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: FriendRequestRepository::class)]
class FriendRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["friend_requests:read"])]
    private ?int $id = null;

    #[ORM\Column(enumType: FriendRequestStatus::class)]
    #[Groups(["friend_requests:read"])]
    private ?FriendRequestStatus $status = FriendRequestStatus::PENDING;

    #[ORM\ManyToOne(inversedBy: 'friendRequests')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["friend_requests:read"])]
    private ?User $requester = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["friend_requests:read"])]
    private ?User $targetUser = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): ?FriendRequestStatus
    {
        return $this->status;
    }

    public function setStatus(FriendRequestStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getRequester(): ?User
    {
        return $this->requester;
    }

    public function setRequester(?User $requester): static
    {
        $this->requester = $requester;

        return $this;
    }

    public function getTargetUser(): ?User
    {
        return $this->targetUser;
    }

    public function setTargetUser(?User $targetUser): static
    {
        $this->targetUser = $targetUser;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
