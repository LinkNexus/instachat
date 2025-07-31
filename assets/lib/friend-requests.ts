import {useEffect} from "react";
import {useAppStore} from "@/lib/store.ts";
import type {FriendRequestEventType} from "@/types.ts";
import {notify} from "@/lib/notifications.ts";
import {navigate} from "wouter/use-browser-location";

export function useFriendRequestsNotifications() {
  const user = useAppStore(state => state.user);
  const {getFriendRequestsChannelUrl, friendsActions} = useAppStore.getState();

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(getFriendRequestsChannelUrl(), {
        withCredentials: true
      });

      eventSource.addEventListener("message", (event) => {
        console.log(event);
        const {event: requestEvent, request} = JSON.parse(event.data) as FriendRequestEventType;

        switch (requestEvent) {
          case "friend_request.created":
            if (request.requester.id !== user.id) {
              friendsActions.addRequest("pending", request);
              friendsActions.alterRequestsCount("pending", 1);
              notify({
                title: `New Friend Request from ${request.requester.name}`,
                body: "You have a new friend request.",
                events: {
                  onClick: () => {
                    navigate(`/friends?tab=pending`, {
                      replace: false
                    });
                  }
                }
              })
            }
            break;

          case "friend_request.accepted":
            if (request.requester.id === user.id) {
              friendsActions.moveRequest(request.id, "accepted");
              friendsActions.alterRequestsCount("pending", -1);
              friendsActions.alterRequestsCount("accepted", 1);
              notify({
                title: `Friend Request Accepted`,
                body: `${request.requester.name} has accepted your friend request.`,
                events: {
                  onClick: () => {
                    navigate(`/friends?tab=accepted`, {
                      replace: false
                    });
                  }
                }
              });
            }
            break;

          case "friend_request.rejected":
            if (request.requester.id === user.id) {
              friendsActions.deleteRequest(request.id);
              friendsActions.alterRequestsCount("pending", -1);
              notify({
                title: `Friend Request Rejected`,
                body: `${request.requester.name} has rejected your friend request.`
              });
            }
            break;
        }
      })

      return () => {
        eventSource.close();
      }
    }
  }, [user]);
}
