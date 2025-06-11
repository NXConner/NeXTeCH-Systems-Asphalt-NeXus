import React from 'react';
import { Button } from './button';

const notifications = [
  { id: 1, message: 'New Job Assigned', action: 'job' },
  { id: 2, message: 'Vehicle Maintenance Due', action: 'maintenance' },
  { id: 3, message: 'Forum Reply Received', action: 'forum' },
];

function handleMarkRead(action: string) {
  console.log(`Notification marked as read: ${action}`);
}

const NotificationsDropdown = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="font-bold mb-2">Notifications</h2>
    <ul>
      {notifications.map(option => (
        <li key={option.id} className="flex items-center justify-between mb-2">
          <span>{option.message}</span>
          <Button onClick={() => handleMarkRead(option.action)} size="sm" aria-label={`Mark ${option.message} as read`}>Mark as Read</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default NotificationsDropdown; 