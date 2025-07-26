<?php

namespace App\Enum;

enum MessageEventType
{
    case CREATED;
    case UPDATED;
    case DELETED;

    public function getName(): string
    {
        return match ($this) {
            self::CREATED => 'message.created',
            self::UPDATED => 'message.updated',
            self::DELETED => 'message.deleted',
        };
    }
}
