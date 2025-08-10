import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover.jsx"
import { NotificationItem } from "../components/notification-item"
import { Separator } from "../components/ui/seperator.jsx"

export function NotificationBell({ notifications, onMarkAsRead, onMarkAllAsRead }) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length
  const recentNotifications = notifications.slice(0, 5) // Show only recent 5

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">{unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-2">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="text-xs">
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
        ) : (
          <div className="h-[400px] overflow-y-auto">
            <div className="divide-y">
              {recentNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} />
              ))}
            </div>
            {notifications.length > 5 && (
              <div className="p-4 text-center">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
