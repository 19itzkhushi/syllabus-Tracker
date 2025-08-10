import useNotificationListener from "../hooks/notificationListner";

export default function GlobalNotificationHandler() {
  useNotificationListener(); // runs every 3s and shows toast
  return null; // invisible component
}