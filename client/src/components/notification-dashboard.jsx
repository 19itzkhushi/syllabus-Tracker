

import { NotificationItem } from "../components/notification-item"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { CheckCheck } from "lucide-react"

export function NotificationDashboard({ notifications, onMarkAsRead, onMarkAllAsRead }) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card className="w-full shadow-lg shadow-gray-400 rounded-none ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 rounded-t-lg border-b-2 border-black ">
        <div className="flex items-center space-x-2 ">
          <CardTitle className="sm:text-2xl text-md">All Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 px-2 text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={onMarkAllAsRead}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 bg-orange-100/50"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="sm:text-md text-xs">Mark all as read</span>
          </Button>
        )}
        {unreadCount == 0 && (
          <Button
            onClick={onMarkAllAsRead}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 bg-orange-200 border-none"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="sm:text-md text-xs">All read</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground">
              <p className="sm:text-lg text-sm font-medium">No notifications yet</p>
              <p className="sm:text-sm text-xs">{"We'll notify you when something happens"}</p>
            </div>
          </div>
        ) : (
          <div className=" h-[600px] overflow-y-auto">
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
