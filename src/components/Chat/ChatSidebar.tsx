import React, { useState, useEffect } from 'react';
import { useChat, ChatMessage } from '@/contexts/ChatContext';
import CommentBubble from './CommentBubble';
import { useToast } from '@/contexts/ToastContext';

const ChatSidebar: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { messages, joinRoom, sendMessage } = useChat();
  const { addToast } = useToast();
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    joinRoom(roomId);
  }, [roomId, joinRoom]);

  const handleSend = async () => {
    if (!text.trim()) {
      addToast({ type: 'error', message: 'Message cannot be empty' });
      return;
    }
    setIsSending(true);
    try {
      await sendMessage(roomId, text.trim());
      setText('');
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to send message' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-sidebar fixed right-0 top-16 bottom-0 w-64 bg-white border-l p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Chat</h3>
      <div className="messages flex-1 overflow-y-auto mb-2">
        {messages.map((m: ChatMessage) => (
          <CommentBubble key={m.id} message={m} />
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-2 py-1 mr-2"
        />
        <button
          onClick={handleSend}
          disabled={isSending || !text.trim()}
          className={`bg-blue-500 text-white px-3 py-1 rounded ${isSending || !text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
