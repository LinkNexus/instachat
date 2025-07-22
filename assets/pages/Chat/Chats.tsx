import {MessageSquare} from "lucide-react";

export function Chats() {
  return (
    <div className="flex-1 flex items-center justify-center bg-muted/20">
      <div className="text-center">
        <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
        <h3 className="text-lg font-semibold mb-2">No chat selected</h3>
        <p className="text-muted-foreground">
          Choose a conversation from the sidebar to start messaging
        </p>
      </div>
    </div>
  );
}
