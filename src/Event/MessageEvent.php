<?php

namespace App\Event;

use App\Entity\Message;
use App\Enum\MessageEventType;

class MessageEvent
{
    public function __construct(
        public Message $message,
        public MessageEventType $type,
    )
    {
    }
}
