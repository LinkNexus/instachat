import {Card, CardContent} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {formatLastSeen} from "@/lib/time.ts";
import {Button} from "@/components/ui/button.tsx";
import type {FriendRequest} from "@/types.ts";

export function PendingRequestCard({ request }: { request: FriendRequest}) {
  return (
    <Card key={0}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={""}/>
              <AvatarFallback>
                {request.requester.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">2</h3>
              <p className="text-sm text-muted-foreground">@1</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-muted-foreground">
                  0 mutual friends
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatLastSeen(new Date().toDateString())}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
            >
              Decline
            </Button>
            <Button>
              Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
