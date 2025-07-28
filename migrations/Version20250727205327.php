<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250727205327 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE friend_request (id SERIAL NOT NULL, requester_id INT NOT NULL, target_user_id INT NOT NULL, status VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_F284D94ED442CF4 ON friend_request (requester_id)');
        $this->addSql('CREATE INDEX IDX_F284D946C066AFE ON friend_request (target_user_id)');
        $this->addSql('ALTER TABLE friend_request ADD CONSTRAINT FK_F284D94ED442CF4 FOREIGN KEY (requester_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE friend_request ADD CONSTRAINT FK_F284D946C066AFE FOREIGN KEY (target_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE friend_request DROP CONSTRAINT FK_F284D94ED442CF4');
        $this->addSql('ALTER TABLE friend_request DROP CONSTRAINT FK_F284D946C066AFE');
        $this->addSql('DROP TABLE friend_request');
    }
}
