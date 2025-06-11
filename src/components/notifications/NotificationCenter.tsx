import { useState, useEffect, useMemo, useCallback } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ErrorBoundary } from '../ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNotifications } from '@/hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const icon = useMemo(() => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  }, [type]);

  return icon;
};

const NotificationItem = ({ notification, onMarkAsRead }: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onMarkAsRead(notification.id);
  }, [notification.id, onMarkAsRead]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors ${
        notification.read ? 'bg-muted/50' : 'bg-background'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <NotificationIcon type={notification.type} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium">
            {notification.title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(notification.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function NotificationCenter() {
  const { notifications, loading, error, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleMarkAsRead = useCallback((id: string) => {
    markAsRead(id);
  }, [markAsRead]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load notifications');
    }
  }, [error]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleOpen}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              >
                {unreadCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="absolute right-0 mt-2 w-80 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleOpen}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No notifications
                  </p>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default (props) => (
  <ErrorBoundary>
    <NotificationCenter {...props} />
  </ErrorBoundary>
);
