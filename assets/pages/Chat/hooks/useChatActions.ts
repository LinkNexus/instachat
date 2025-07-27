import {toast} from "sonner";
import {apiFetch} from "@/lib/fetch.ts";
import {useAppStore} from "@/lib/store.ts";
import type {Message} from "@/types.ts";

export function useChatActions() {
    const {deleteMessage, updateMessage} = useAppStore.getState().conversationsActions;
    // Message action handlers
    const handleEditMessage = async (messageId: number, newContent: string) => {
        apiFetch<Message>(`/api/messages/${messageId}`, {
            method: 'PUT',
            data: {content: newContent},
        })
            .then((message) => {
                updateMessage(message);
                toast.success("Message edited successfully");
            })
            .catch(err => {
                console.error("Failed to edit message:", err);
                toast.error("Failed to edit message");
            });
    };

    const handleDeleteMessage = (messageId: number) => {
        apiFetch(`/api/messages/${messageId}`, {
            method: "DELETE"
        }).then(() => {
            deleteMessage(messageId)
            toast.success("Message deleted successfully");
        })
    };

    const handleCopyMessage = (_content: string) => {
        toast.success("Message copied to clipboard");
    };

    return {
        handleEditMessage,
        handleDeleteMessage,
        handleCopyMessage,
    };
}
