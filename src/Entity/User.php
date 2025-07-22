<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Deprecated;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["user:read", "users:read", "messages:read"])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(["user:read"])]
    #[Assert\Email(message: "The email {{ value }} is not a valid email address.")]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(["user:read", "users:read"])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Assert\Sequentially([
        new Assert\PasswordStrength,
        new Assert\NotCompromisedPassword
    ])]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(["user:read", "users:read"])]
    #[Assert\Sequentially([
        new Assert\Length(min: 3, max: 255, minMessage: "The name must be at least {{ limit }} characters long", maxMessage: "The name must be at most {{ limit }} characters long"),
        new Assert\Regex(pattern: "/^[a-zA-Z0-9_ ]+$/", message: "The name can only contain letters, numbers, spaces and underscores.")
    ])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(["user:read"])]
    private ?bool $isVerified = null;

    #[ORM\Column(length: 255)]
    #[Assert\Sequentially([
        new Assert\Length(min: 3, max: 255, minMessage: "The username must be at least {{ limit }} characters long", maxMessage: "The username must be at most {{ limit }} characters long"),
        new Assert\Regex(pattern: "/^[a-zA-Z0-9_]+$/", message: "The username can only contain letters, numbers and underscores.")
    ])]
    #[Groups(["user:read", "users:read"])]
    private ?string $username = null;

    #[ORM\Column(length: 200, nullable: true)]
    #[Groups(["user:read", "users:read"])]
    private ?string $bio = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array)$this;
        $data["\0" . self::class . "\0password"] = hash('crc32c', $this->password);

        return $data;
    }

    #[Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function isVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }
}
