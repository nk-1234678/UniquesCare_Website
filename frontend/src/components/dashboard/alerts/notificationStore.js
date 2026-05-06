const NOTIFICATION_KEY = "dashboard_notifications_v1";
const DISMISSED_KEY = "dismissed_alerts_v1";

export const getDismissedKey = () => DISMISSED_KEY;

export const loadNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveNotifications = (notifications) => {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
};

export const appendNotification = (notification) => {
  const next = [notification, ...loadNotifications().filter((item) => item.id !== notification.id)];
  saveNotifications(next);
  return next;
};

export const loadDismissed = () => {
  try {
    const raw = localStorage.getItem(getDismissedKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveDismissed = (ids) => {
  localStorage.setItem(getDismissedKey(), JSON.stringify(ids));
};
