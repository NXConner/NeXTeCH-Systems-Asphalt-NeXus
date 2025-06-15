import React from 'react';
import { ChatMessage } from '@/contexts/ChatContext';

const CommentBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <div className="comment-bubble">
      <strong>{message.user}</strong> <em>{new Date(message.timestamp).toLocaleTimeString()}</em>
      <p>{message.text}</p>
    </div>
  );
};

export default CommentBubble;
