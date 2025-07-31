<?php

namespace App\Event;

use App\Entity\FriendRequest;
use App\Enum\FriendRequestEventType;

class FriendRequestEvent
{
    public function __construct(
        public FriendRequest $friendRequest,
        public FriendRequestEventType $type
    )
    {
    }
}
