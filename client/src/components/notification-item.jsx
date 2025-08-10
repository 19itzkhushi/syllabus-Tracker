
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Heart, MessageCircle, UserPlus, AtSign, Star, Dot } from "lucide-react";
import {formatDistanceToNow} from "../lib/date-utils";

const getNotificationIcon = (type) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />
    case "comment":
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    case "follow":
      return <UserPlus className="h-4 w-4 text-green-500" />
    case "mention":
      return <AtSign className="h-4 w-4 text-purple-500" />
    case "system":
      return <Star className="h-4 w-4 text-yellow-500" />
    default:
      return <Dot className="h-4 w-4" />
  }
}

const getNotificationTypeLabel = (type) => {
  switch (type) {
    case "like":
      return "Like"
    case "comment":
      return "Comment"
    case "follow":
      return "Follow"
    case "mention":
      return "Mention"
    case "system":
      return "System"
    default:
      return "Notification"
  }
}

export function NotificationItem({ notification, onMarkAsRead }) {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
  }

  return (
    <div
      className={`flex items-start space-x-4 p-4 transition-colors hover:bg-muted/50 cursor-pointer ${
        !notification.read ? "bg-orange-200/50 dark:bg-blue-950/20" : "bg-orange-50"
      }`}
      onClick={handleClick}
    >
      {/* Unread indicator dot */}
      {!notification.read && (
        <div className="flex-shrink-0 mt-2">
          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
        </div>
      )}

      {/* Avatar */}
      {/* <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={notification.avatar || "/placeholder.svg"} alt="User avatar" />
        <AvatarFallback>{getNotificationIcon(notification.type)}</AvatarFallback>
      </Avatar> */}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {getNotificationTypeLabel(notification.type)}
              </Badge>
              {!notification.read && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                  New
                </Badge>
              )}
            </div>
            <p className={`text-sm ${!notification.read ? "font-medium" : "text-muted-foreground"}`}>
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
            </p>
          </div>

          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onMarkAsRead(notification.id)
              }}
              className="text-xs"
            >
              Mark as read
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
