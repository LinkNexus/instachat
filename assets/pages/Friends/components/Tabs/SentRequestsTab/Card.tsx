import {Card, CardContent} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {formatLastSeen} from "@/lib/time.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {FriendRequest} from "@/types.ts";

export function SentRequestCard({ request }: { request: FriendRequest}) {
  return (
    <Card key={request.id} className="border border-border">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarImage src={request.targetUser.profileImage || ""}/>
              <AvatarFallback className="text-xs sm:text-sm font-medium">
                {request.targetUser.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-foreground truncate leading-tight">
                {request.targetUser.name}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                @{request.targetUser.username}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                <span className="text-xs text-muted-foreground">
                  {0} mutual friends
                </span>
                <span className="text-xs text-muted-foreground">
                  Sent {formatLastSeen(request.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div
            className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
            <Badge variant="secondary" className="text-xs px-2 py-1 order-2 sm:order-1">
              Pending
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={console.log}
              className="px-3 h-8 text-xs font-medium order-1 sm:order-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
