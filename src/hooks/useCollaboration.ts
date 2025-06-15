import { useState, useEffect, useCallback } from 'react';
import { useMap } from 'react-leaflet';
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

interface CollaborationState {
  users: User[];
  messages: Message[];
  isConnected: boolean;
}

interface UseCollaborationOptions {
  onStateChange?: (state: CollaborationState) => void;
  onUserJoin?: (user: User) => void;
  onUserLeave?: (userId: string) => void;
  onMessage?: (message: Message) => void;
}

export const useCollaboration = ({
  onStateChange,
  onUserJoin,
  onUserLeave,
  onMessage
}: UseCollaborationOptions = {}) => {
  const map = useMap();
  const [state, setState] = useState<CollaborationState>({
    users: [],
    messages: [],
    isConnected: false
  });

  const addUser = useCallback((user: User) => {
    setState(prev => {
      const newState = {
        ...prev,
        users: [...prev.users, user]
      };
      onStateChange?.(newState);
      onUserJoin?.(user);
      return newState;
    });
  }, [onStateChange, onUserJoin]);

  const removeUser = useCallback((userId: string) => {
    setState(prev => {
      const user = prev.users.find(u => u.id === userId);
      if (user?.marker) {
        map.removeLayer(user.marker);
      }

      const newState = {
        ...prev,
        users: prev.users.filter(u => u.id !== userId)
      };
      onStateChange?.(newState);
      onUserLeave?.(userId);
      return newState;
    });
  }, [map, onStateChange, onUserLeave]);

  const updateUserPosition = useCallback((userId: string, position: [number, number]) => {
    setState(prev => {
      const newUsers = prev.users.map(user => {
        if (user.id === userId) {
          if (user.marker) {
            user.marker.setLatLng(position);
          }
          return { ...user, position };
        }
        return user;
      });

      const newState = {
        ...prev,
        users: newUsers
      };
      onStateChange?.(newState);
      return newState;
    });
  }, [onStateChange]);

  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };

    setState(prev => {
      const newState = {
        ...prev,
        messages: [...prev.messages, newMessage]
      };
      onStateChange?.(newState);
      onMessage?.(newMessage);
      return newState;
    });
  }, [onStateChange, onMessage]);

  const clearMessages = useCallback(() => {
    setState(prev => {
      const newState = {
        ...prev,
        messages: []
      };
      onStateChange?.(newState);
      return newState;
    });
  }, [onStateChange]);

  const setConnectionStatus = useCallback((isConnected: boolean) => {
    setState(prev => {
      const newState = {
        ...prev,
        isConnected
      };
      onStateChange?.(newState);
      return newState;
    });
  }, [onStateChange]);

  useEffect(() => {
    if (!map) return;

    // Initialize current user
    const currentUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'You',
      color: '#3388ff',
      position: [map.getCenter().lat, map.getCenter().lng]
    };

    // Create marker for current user
    const marker = L.marker(currentUser.position, {
      icon: L.divIcon({
        className: 'user-marker',
        html: `<div style="background-color: ${currentUser.color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`
      })
    }).addTo(map);

    currentUser.marker = marker;
    addUser(currentUser);

    // Update marker position on map move
    const handleMapMove = () => {
      const center = map.getCenter();
      marker.setLatLng([center.lat, center.lng]);
      updateUserPosition(currentUser.id, [center.lat, center.lng]);
    };

    map.on('moveend', handleMapMove);

    return () => {
      map.off('moveend', handleMapMove);
      map.removeLayer(marker);
      removeUser(currentUser.id);
    };
  }, [map, addUser, removeUser, updateUserPosition]);

  return {
    ...state,
    addUser,
    removeUser,
    updateUserPosition,
    sendMessage,
    clearMessages,
    setConnectionStatus
  };
}; 