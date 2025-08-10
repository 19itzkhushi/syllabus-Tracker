import { useEffect ,useState} from "react";
import { useToast } from "../hooks/use-toast";
import API from "../api/axios";

export default function useNotificationListener() {
  const { toast } = useToast();
  const [unread,setunread] = useState(0);
 

  useEffect(() => {
   

    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notify/getallnotification", {
          withCredentials: true,
        });
        const data = res.data.data || [];
        const unread2 =  data.filter((n)=> n.read !==true)
        setunread(unread2.length);
        const now = Date.now();

        for (const n of data) {
          const createdAt = new Date(n.createdAt).getTime();
          const secondsSinceCreated = (now - createdAt) / 1000;

          // If notification was created within the last 5 seconds AND not yet popped
          if (!n.popped && secondsSinceCreated < 5) {
            toast({
              title: "🔔 New Notification",
              description: n.message || "You have a new reminder!",
              duration: 3000,
            });

            await API.patch(
              "/notify/pop",
              { notificationId: n._id },
              { withCredentials: true }
            );
          }
        }
        
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000); // Every 3 seconds
    return () => clearInterval(interval);
  }, []);


  return {unread};
}

