import { useState, useCallback, useEffect } from "react";
import { apiService } from '../services/apiService';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };
    await apiService.createNotification(newNotification);
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    await apiService.updateNotification(id, { read: true });
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { 
    notifications, 
    loading, 
    error, 
    addNotification, 
    markAsRead,
    refetch: fetchNotifications 
  };
}
