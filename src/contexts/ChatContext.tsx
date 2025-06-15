import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  roomId: string;
  user: string;
  text: string;
  timestamp: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  joinRoom: (roomId: string) => void;
  sendMessage: (roomId: string, text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      channelRef.current?.unsubscribe();
    };
  }, []);

  const joinRoom = (roomId: string) => {
    if (channelRef.current) channelRef.current.unsubscribe();
    const channel = supabase.channel(`chat-${roomId}`);
    channel.subscribe();
    channel.on('broadcast', { event: 'new-message' }, ({ payload }) => {
      setMessages(prev => [...prev, payload]);
    });
    channelRef.current = channel;
  };

  const sendMessage = async (roomId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      roomId,
      user: supabase.auth.getUser().then(r => r.data.user?.email ?? ''),
      text,
      timestamp: new Date().toISOString(),
    } as any;
    setMessages(prev => [...prev, newMessage]);
    if (channelRef.current) {
      channelRef.current.send({ type: 'broadcast', event: 'new-message', payload: newMessage });
    }
    // @ts-ignore: table not defined in Database types
    await supabase.from('chat_messages').insert([newMessage]);
  };

  return (
    <ChatContext.Provider value={{ messages, joinRoom, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
