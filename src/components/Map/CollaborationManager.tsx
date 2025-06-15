import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Share2, UserPlus, UserMinus, MessageSquare } from 'lucide-react';
import * as L from 'leaflet';

interface User {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  position?: [number, number];
  marker?: L.Marker;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

interface CollaborationManagerProps {
  onUserJoin?: (user: User) => void;
  onUserLeave?: (userId: string) => void;
  onMessage?: (message: Message) => void;
}

export const CollaborationManager: React.FC<CollaborationManagerProps> = ({
  onUserJoin,
  onUserLeave,
  onMessage
}) => {
  const map = useMap();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!map) return;

    // Initialize current user
    const currentUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'You',
      color: '#3388ff',
      position: [map.getCenter().lat, map.getCenter().lng]
    };

    setUsers([currentUser]);

    // Create marker for current user
    const marker = L.marker(currentUser.position, {
      icon: L.divIcon({
        className: 'user-marker',
        html: `<div style="background-color: ${currentUser.color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`
      })
    }).addTo(map);

    // Update marker position on map move
    const handleMapMove = () => {
      const center = map.getCenter();
      marker.setLatLng([center.lat, center.lng]);
      currentUser.position = [center.lat, center.lng];
    };

    map.on('moveend', handleMapMove);

    return () => {
      map.off('moveend', handleMapMove);
      map.removeLayer(marker);
    };
  }, [map]);

  const handleInviteUser = () => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: `User ${users.length + 1}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      position: [map.getCenter().lat, map.getCenter().lng]
    };

    const marker = L.marker(newUser.position, {
      icon: L.divIcon({
        className: 'user-marker',
        html: `<div style="background-color: ${newUser.color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`
      })
    }).addTo(map);

    newUser.marker = marker;
    setUsers(prev => [...prev, newUser]);
    onUserJoin?.(newUser);
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(prev => {
      const user = prev.find(u => u.id === userId);
      if (user?.marker) {
        map.removeLayer(user.marker);
      }
      onUserLeave?.(userId);
      return prev.filter(u => u.id !== userId);
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      userId: users[0].id,
      userName: users[0].name,
      content: newMessage,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, message]);
    onMessage?.(message);
    setNewMessage('');
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Users className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleInviteUser}
          className="bg-background/80 backdrop-blur-sm"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-2 w-80 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="p-4">
            <div className="space-y-4">
              {/* Users List */}
              <div>
                <h3 className="text-sm font-medium mb-2">Active Users</h3>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {users.map(user => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{user.name}</span>
                        </div>
                        {user.id !== users[0].id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveUser(user.id)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat */}
              <div>
                <h3 className="text-sm font-medium mb-2">Chat</h3>
                <ScrollArea className="h-48 mb-2">
                  <div className="space-y-2">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className="flex flex-col"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {message.userName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSendMessage}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 