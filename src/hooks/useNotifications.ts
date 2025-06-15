import { useState, useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (!('Notification' in window)) return;

    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      trackEvent({
        category: 'Notifications',
        action: 'permission',
        label: permission,
      });
    };

    requestPermission();
  }, [trackEvent]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID();
    const newNotification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);
    trackEvent({
      category: 'Notifications',
      action: 'add',
      label: notification.type,
    });

    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon.png',
      });
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
} 