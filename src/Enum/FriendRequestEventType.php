<?php

namespace App\Enum;

enum FriendRequestEventType: string
{
    case ACCEPTED = "accepted";
    case CREATED = "created";
    case REJECTED = "rejected";

    public function getName(): string {
        return match ($this) {
            self::ACCEPTED => "friend_request.accepted",
            self::CREATED => "friend_request.created",
            self::REJECTED => "friend_request.rejected",
        };
    }
}
