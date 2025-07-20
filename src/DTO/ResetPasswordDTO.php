<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class ResetPasswordDTO
{

    #[Assert\Sequentially([
        new Assert\PasswordStrength(),
        new Assert\NotCompromisedPassword,
    ])]
    public string $password;

    #[Assert\EqualTo(propertyPath: "password", message: "The passwords must match")]
    public string $confirmPassword;
}
