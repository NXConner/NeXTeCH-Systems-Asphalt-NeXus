import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const OnlineUsers: React.FC = () => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('presence');
    channel.subscribe();
    channel.track({ user_id: user.id, email: (user as any).email });
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const users = Object.values(state)
        .flat()
        .map((u: any) => u.email);
      setOnlineUsers(users);
    });
    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  return (
    <div className="online-users text-sm ml-4">
      <strong>Online:</strong>
      <ul className="list-disc list-inside">
        {onlineUsers.map(email => (
          <li key={email}>{email}</li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
