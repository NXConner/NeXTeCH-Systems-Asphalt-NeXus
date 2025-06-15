import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  roomId: string;
  user: string;
  text: string;
  timestamp: string;
}

export const fetchChatHistory = async (roomId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase.from<ChatMessage>('chat_messages').select('*').eq('roomId', roomId);
  if (error) throw error;
  return data ?? [];
};

export const postMessage = async (message: ChatMessage): Promise<void> => {
  const { error } = await supabase.from<ChatMessage>('chat_messages').insert([message]);
  if (error) throw error;
};
