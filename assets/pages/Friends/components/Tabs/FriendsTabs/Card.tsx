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
} from "@/components/ui/alert-dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import type {FriendRequest, User} from "@/types";
import {MessageSquare, MoreVertical, Phone, UserX, Video} from "lucide-react";

export function FriendCard({request, user}: { request: FriendRequest; user: User }) {
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
