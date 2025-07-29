<?php

namespace App\Enum;

enum FriendRequestCategory: string
{
    case ACCEPTED = 'accepted';
    case PENDING = 'pending';
    case SENT = 'sent';
}
