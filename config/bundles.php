<?php

return [
    Symfony\Bundle\FrameworkBundle\FrameworkBundle::class => ['all' => true],
    Symfony\Bundle\TwigBundle\TwigBundle::class => ['all' => true],
    Symfony\Bundle\MakerBundle\MakerBundle::class => ['dev' => true],
    Pentatrion\ViteBundle\PentatrionViteBundle::class => ['all' => true],
    Symfony\Bundle\SecurityBundle\SecurityBundle::class => ['all' => true],
    Doctrine\Bundle\DoctrineBundle\DoctrineBundle::class => ['all' => true],
    Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle::class => ['all' => true],
    SymfonyCasts\Bundle\VerifyEmail\SymfonyCastsVerifyEmailBundle::class => ['all' => true],
    Twig\Extra\TwigExtraBundle\TwigExtraBundle::class => ['all' => true],
    Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle::class => ['dev' => true, 'test' => true],
    SymfonyCasts\Bundle\ResetPassword\SymfonyCastsResetPasswordBundle::class => ['all' => true],
    Zenstruck\Foundry\ZenstruckFoundryBundle::class => ['dev' => true, 'test' => true],
    Symfony\Bundle\MercureBundle\MercureBundle::class => ['all' => true],
];
