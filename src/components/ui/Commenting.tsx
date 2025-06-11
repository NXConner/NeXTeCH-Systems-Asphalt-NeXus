import React from 'react';
import { Button } from './button';

const commentActions = [
  { id: 1, name: 'Add Comment', action: 'add' },
  { id: 2, name: 'Edit Comment', action: 'edit' },
  { id: 3, name: 'Delete Comment', action: 'delete' },
];

function handleComment(action: string) {
  console.log(`Comment action: ${action}`);
}

const Commenting = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="font-bold mb-2">Commenting</h2>
    <ul>
      {commentActions.map(option => (
        <li key={option.id} className="flex items-center justify-between mb-2">
          <span>{option.name}</span>
          <Button onClick={() => handleComment(option.action)} size="sm" aria-label={`${option.name}`}>Trigger</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default Commenting; 