<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250727203705 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE friendships (user_id INT NOT NULL, friend_id INT NOT NULL, PRIMARY KEY(user_id, friend_id))');
        $this->addSql('CREATE INDEX IDX_E0A8B7CAA76ED395 ON friendships (user_id)');
        $this->addSql('CREATE INDEX IDX_E0A8B7CA6A5458E8 ON friendships (friend_id)');
        $this->addSql('ALTER TABLE friendships ADD CONSTRAINT FK_E0A8B7CAA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE friendships ADD CONSTRAINT FK_E0A8B7CA6A5458E8 FOREIGN KEY (friend_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE friendships DROP CONSTRAINT FK_E0A8B7CAA76ED395');
        $this->addSql('ALTER TABLE friendships DROP CONSTRAINT FK_E0A8B7CA6A5458E8');
        $this->addSql('DROP TABLE friendships');
    }
}
