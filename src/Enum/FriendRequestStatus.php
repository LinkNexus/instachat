<?php

namespace App\Enum;

enum FriendRequestStatus: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
}
