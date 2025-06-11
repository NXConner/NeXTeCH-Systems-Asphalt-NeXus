import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';

const userActions = [
  { id: 1, name: 'Profile', action: 'profile' },
  { id: 2, name: 'Settings', action: 'settings' },
  { id: 3, name: 'Logout', action: 'logout' },
];

function handleUserAction(action: string) {
  console.log(`User action: ${action}`);
}

export default function UserAvatarMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    navigate('/login');
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative ml-2" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(o => !o)}
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg">
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span>{user?.email?.[0]?.toUpperCase() || '?'}</span>
          )}
        </div>
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
          <ul>
            {userActions.map(option => (
              <li key={option.id} className="flex items-center justify-between mb-2">
                <span>{option.name}</span>
                <Button onClick={() => handleUserAction(option.action)} size="sm" aria-label={`Go to ${option.name}`}>Go</Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 