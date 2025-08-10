
import { useEffect, useState ,useRef} from "react";
import API from "../api/axios"; // your axios instance
import { useAuth } from "../context/AuthContext";
import useNotificationListener from "../hooks/notificationListner";
import { NotificationDashboard } from "../components/notification-dashboard";
import { useToast } from "../hooks/use-toast";

export default function Home() {
  const [notifications, setNotifications] = useState([]);
  const prevNotifications = useRef([]);
  const { toast } = useToast();
  const {unread} = useNotificationListener();
  const [prevdata,setprevdata] = useState([]);
  console.log(unread)
  

  // ✅ Fetch from backend
useEffect(() => {
  const cached = localStorage.getItem("prevNotifications");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
         const restored = parsed.map((n) => ({
      ...n,
      timestamp: n.timestamp ? new Date(n.timestamp) : null,
    }));
        setNotifications(restored);
      } catch (err) {
        console.error("Failed to parse cached notifications:", err);
      }
    }
  const fetchNotifications = async () => {
    
    try {
     
     const res = await API.get("/notify/getallnotification", {
  withCredentials: true
});
      const data = res.data.data || [];

      const transformed = data.map((n) => ({
        id: n._id,
        type: n.type || "string",
        message: n.message || "",
        timestamp: new Date(n.createdAt),
        read: n.read,
        popped: n.popped || false,
      }));

      
      setNotifications(transformed);

      localStorage.setItem("prevNotifications", JSON.stringify(transformed));
       
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  fetchNotifications();
}, [unread]);



const markAsRead = async (id) => {
  try {
    await API.patch("/notify/markedread", { notificationId: id }, {
      withCredentials: true,
    });

    const updated = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    
    setNotifications(updated);
    localStorage.setItem("prevNotifications", JSON.stringify(updated));
  } catch (err) {
    console.error("Error marking notification as read", err);
  }
};

const markAllAsRead = async () => {
  try {
    await API.patch("/notify/markallread", {
      withCredentials: true,
    });

    const updated = notifications.map((notif) => ({
      ...notif,
      read: true,
    }));

    setNotifications(updated);
    localStorage.setItem("prevNotifications", JSON.stringify(updated));
  } catch (err) {
    console.error("Error marking all notifications as read", err);
  }
};

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
 
      <div className="flex justify-center py-5 bg-background">
        <div className="w-full  max-w-4xl mx-auto px-2 ">
          <NotificationDashboard
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />
        </div>
    
    </div>
  );
}
