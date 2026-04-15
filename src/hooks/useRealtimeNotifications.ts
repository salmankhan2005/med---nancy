import { useEffect, useState } from "react";
import { subscribeToNotifications } from "../lib/realtimeDb";
import { useAuthStore } from "../stores/authStore";

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user?.firebaseUid) return;

    const unsubscribe = subscribeToNotifications(user.firebaseUid, (data) => {
      if (data) {
        const notifsArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        })).sort((a, b) => b.createdAt - a.createdAt);
        setNotifications(notifsArray);
      } else {
        setNotifications([]);
      }
    });

    return () => unsubscribe();
  }, [user?.firebaseUid]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount };
}
