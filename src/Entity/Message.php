<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["messages:read"])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["messages:read"])]
    private ?User $sender = null;

    #[ORM\ManyToOne]
    #[Groups(["messages:read"])]
    private ?User $receiver = null;

    #[ORM\Column]
    #[Groups(["messages:read"])]
    private ?DateTimeImmutable $createdAt;

    #[ORM\Column]
    #[Groups(["messages:read"])]
    private ?DateTimeImmutable $modifiedAt;

    #[ORM\Column(nullable: true)]
    #[Groups(["messages:read"])]
    private ?DateTimeImmutable $readAt = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(["messages:read"])]
    #[Assert\NotBlank]
    private ?string $content = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'relatedMessages')]
    private ?self $repliedMessage = null;

    /**
     * @var Collection<int, self>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'repliedMessage')]
    private Collection $relatedMessages;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->modifiedAt = new DateTimeImmutable();
        $this->relatedMessages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): static
    {
        $this->sender = $sender;

        return $this;
    }

    public function getReceiver(): ?User
    {
        return $this->receiver;
    }

    public function setReceiver(?User $receiver): static
    {
        $this->receiver = $receiver;

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

    public function getModifiedAt(): ?DateTimeImmutable
    {
        return $this->modifiedAt;
    }

    public function setModifiedAt(DateTimeImmutable $modifiedAt): static
    {
        $this->modifiedAt = $modifiedAt;

        return $this;
    }

    public function getReadAt(): ?DateTimeImmutable
    {
        return $this->readAt;
    }

    public function setReadAt(?DateTimeImmutable $readAt): static
    {
        $this->readAt = $readAt;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getRepliedMessage(): ?self
    {
        return $this->repliedMessage;
    }

    public function setRepliedMessage(?self $repliedMessage): static
    {
        $this->repliedMessage = $repliedMessage;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getRelatedMessages(): Collection
    {
        return $this->relatedMessages;
    }

    public function addRelatedMessage(self $relatedMessage): static
    {
        if (!$this->relatedMessages->contains($relatedMessage)) {
            $this->relatedMessages->add($relatedMessage);
            $relatedMessage->setRepliedMessage($this);
        }

        return $this;
    }

    public function removeRelatedMessage(self $relatedMessage): static
    {
        if ($this->relatedMessages->removeElement($relatedMessage)) {
            // set the owning side to null (unless already changed)
            if ($relatedMessage->getRepliedMessage() === $this) {
                $relatedMessage->setRepliedMessage(null);
            }
        }

        return $this;
    }
}
