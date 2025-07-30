import {Card, CardContent} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {formatLastSeen} from "@/lib/time.ts";
import {Button} from "@/components/ui/button.tsx";
import type {FriendRequest} from "@/types.ts";
import {useApiFetch} from "@/lib/fetch.ts";
import {useAppStore} from "@/lib/store.ts";
import {toast} from "sonner";

export function PendingRequestCard({request}: { request: FriendRequest }) {
  const {moveRequest, alterRequestsCount} = useAppStore.getState().friendsActions;
  const {
    loading: isAccepting,
    callback: acceptRequest,
  } = useApiFetch(`/api/friend-requests/${request.id}/accept`, {
    method: "PUT",
    onSuccess() {
      moveRequest(request.id, "accepted");
      alterRequestsCount("pending", -1);
      alterRequestsCount("accepted", 1);
      toast.success("Friend request accepted");
    },
    onError(err) {
      console.log("Error accepting friend request:", err);
      toast.error("Error accepting friend request");
    }
  })
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
              <h3 className="font-semibold">{request.requester.name}</h3>
              <p className="text-sm text-muted-foreground">@{request.requester.username}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-muted-foreground">
                  0 mutual friends
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatLastSeen(request.createdAt)}
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
            <Button
              onClick={async () => {
                await acceptRequest();
              }}
              disabled={isAccepting}
            >
              Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
