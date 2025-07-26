import {Button} from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {formatMessageTime} from "@/lib/time.ts";
import {cn} from "@/lib/utils.ts";
import type {Message} from "@/types.ts";
import {Check, CheckCheck, Copy, Edit3, MoreVertical, Reply, Trash2, X} from "lucide-react";
import {useState} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageComponentProps {
  message: Message;
  isMyMessage: boolean;
  onEdit?: (messageId: number, newContent: string) => void;
  onDelete?: (messageId: number) => void;
  onReply?: (message: Message) => void;
  onCopy?: (content: string) => void;
  showReadStatus?: boolean;
}

export function MessageComponent({
  message,
  isMyMessage,
  onEdit,
  onDelete,
  onReply,
  onCopy,
  showReadStatus = true
}: MessageComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(message.content);
    onCopy?.(message.content);
  };

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReply?.(message);
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditContent(message.content);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editContent.trim() !== message.content && editContent.trim() !== "") {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(message.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit(e as any);
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit(e as any);
    }
  };

  // Keep hover state active when dropdown is open or editing
  const shouldShowActions = (isHovered || isDropdownOpen) && !isEditing;

  return (
    <div
      key={message.id}
      className={`group flex ${isMyMessage ? "justify-end" : "justify-start"} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={(e) => {
        // Don't hide if mouse is moving to the dropdown menu
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || !relatedTarget.closest('[role="menu"]')) {
          setIsHovered(false);
        }
      }}
    >
      {/* Quick Actions - Show on hover or when dropdown is open */}
      {shouldShowActions && (
        <div className={`flex items-center gap-1 mx-2 ${isMyMessage ? "order-first" : "order-last"}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-70 hover:opacity-100 bg-background/80 backdrop-blur-sm shadow-sm"
            onClick={handleReply}
          >
            <Reply className="h-4 w-4" />
          </Button>

          <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-70 hover:opacity-100 bg-background/80 backdrop-blur-sm shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isMyMessage ? "start" : "end"} className="w-48">
              <DropdownMenuItem onClick={handleReply}>
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy text
              </DropdownMenuItem>
              {isMyMessage && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleStartEdit}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-3 py-2 rounded-lg transition-all duration-200",
          isMyMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted",
          isHovered && "shadow-md"
        )}
      >
        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] text-sm resize-none border-0 p-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveEdit}
                disabled={editContent.trim() === "" || editContent.trim() === message.content}
                className="h-6 px-2 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Display Mode */
          <>
            <div className="break-words prose dark:prose-invert prose-sm">
              <Markdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </Markdown>
            </div>

            {/* Message Footer */}
            <div className={cn(
              "flex items-center justify-between mt-2 gap-2",
              isMyMessage ? "flex-row-reverse" : "flex-row"
            )}>
              <p className="text-xs opacity-70 whitespace-nowrap">
                {formatMessageTime(message.createdAt)}
              </p>

              {/* Read Status - Only for sent messages */}
              {isMyMessage && showReadStatus && (
                <div className="flex items-center">
                  {message.readAt ? (
                    <CheckCheck className="h-3 w-3 opacity-70" />
                  ) : (
                    <Check className="h-3 w-3 opacity-70" />
                  )}
                </div>
              )}
            </div>

            {/* Edit Indicator */}
            {message.editedAt && (
              <p className="text-xs opacity-50 mt-1">
                edited
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
