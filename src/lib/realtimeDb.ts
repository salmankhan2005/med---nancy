import { ref, onValue, set, push, update, remove } from "firebase/database";
import { db } from "./firebase";

// Helper to subscribe to patient notifications
export const subscribeToNotifications = (userId: string, callback: (data: any) => void) => {
  const notificationsRef = ref(db, `notifications/${userId}`);
  return onValue(notificationsRef, (snapshot) => {
    callback(snapshot.val());
  });
};

// Helper to push a new realtime notification
export const pushNotification = async (userId: string, notification: any) => {
  const notificationsRef = ref(db, `notifications/${userId}`);
  const newNotifRef = push(notificationsRef);
  await set(newNotifRef, {
    ...notification,
    id: newNotifRef.key,
    createdAt: Date.now()
  });
  return newNotifRef.key;
};

// Helper to mark notification as read in rtdb
export const markNotificationRead = async (userId: string, notifId: string) => {
  const notifRef = ref(db, `notifications/${userId}/${notifId}`);
  await update(notifRef, { read: true });
};

// Helper to subscribe to report status changes
export const subscribeToReportStatus = (reportId: string, callback: (status: string) => void) => {
  const reportRef = ref(db, `reports/${reportId}/status`);
  return onValue(reportRef, (snapshot) => {
    callback(snapshot.val());
  });
};

// Helper to update report status in rtdb
export const updateReportStatusRt = async (reportId: string, status: string) => {
  const reportRef = ref(db, `reports/${reportId}`);
  await update(reportRef, { status, updatedAt: Date.now() });
};
