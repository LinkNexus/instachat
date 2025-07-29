import {Card, CardContent} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MessageSquare, MoreVertical, Phone, UserPlus, UserX, Video} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import type {FriendRequest, User} from "@/types.ts";
import {useAppStore} from "@/lib/store.ts";

interface FriendsTabsProps {
  requests: FriendRequest[];
  loaded: boolean;
  count: number;
}

export function FriendsTabs({requests, loaded, count}: FriendsTabsProps) {
  const user = useAppStore(state => state.user);
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="grid gap-4">
        {requests.map((request) => (
          <FriendCard key={request.id} request={request} user={user!}/>
        ))}
        {loaded && count === 0 && (
          <div className="text-center py-12">
            <UserPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
            <h3 className="text-lg font-semibold mb-2">No friends found</h3>
            <p className="text-muted-foreground">
              {null ? "Try adjusting your search" : "Start by adding some friends!"}
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

function FriendCard({request, user}: { request: FriendRequest; user: User }) {
  const friend = request.requester.id === user.id ? request.targetUser : request.requester
  return (
    <Card key={request.id}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={""}/>
                <AvatarFallback>
                  {friend.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {true && (
                <div
                  className="absolute bottom-0 right-0 w-3 h-3 bg-chart-1 rounded-full border-2 border-background"/>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{friend.name}</h3>
              <p className="text-sm text-muted-foreground">@{friend.username}</p>
              <div className="flex items-center space-x-4 mt-1">
                {/*<span className="text-xs text-muted-foreground">*/}
                {/*  {true ? (*/}
                {/*    <Badge variant="secondary"*/}
                {/*           className="text-xs">Online</Badge>*/}
                {/*  ) : (*/}
                {/*    `Last seen ${formatLastSeen(new Date())}`*/}
                {/*  )}*/}
                {/*</span>*/}
                <span className="text-xs text-muted-foreground">
                  0 mutual friends
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <MessageSquare className="h-4 w-4"/>
            </Button>
            <Button variant="outline" size="icon">
              <Phone className="h-4 w-4"/>
            </Button>
            <Button variant="outline" size="icon">
              <Video className="h-4 w-4"/>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Block</DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <UserX className="h-4 w-4 mr-2"/>
                      Remove Friend
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {friend.name} from your friends list?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
