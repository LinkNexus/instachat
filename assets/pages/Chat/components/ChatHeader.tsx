import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {Conversation} from "@/types.ts";
import {ArrowLeft, MoreVertical, Phone, Search, Video} from "lucide-react";
import {navigate} from "wouter/use-browser-location";

interface ChatHeaderProps {
    conversation: Conversation;
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
    return (
        <div className="p-4 border-b bg-card">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {/* Mobile back button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => navigate("/chat", { replace: false })}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>
                                {(conversation?.partner?.name?.split(' ').map(n => n[0]).join('')) || ""}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <div>
                        <h2 className="font-semibold">{conversation?.partner?.name}</h2>
                        <p className="text-sm text-muted-foreground">
                            {false ? "Online" : "Last seen recently"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
