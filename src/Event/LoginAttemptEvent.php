<?php

namespace App\Event;

use App\Entity\User;

final readonly class LoginAttemptEvent
{
    public function __construct(private User $user)
    {}

    public function getUser(): User
    {
        return $this->user;
    }
}
