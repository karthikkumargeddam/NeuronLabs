"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Strapi WebSocket server
    const socketInstance = io(process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337', {
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to notification server');
      // If we have a user, join their personal room
      if (session?.user?.id) {
        socketInstance.emit('join', session.user.id);
      }
    });

    socketInstance.on('new_notification', (data) => {
      // Display toast notification
      toast(data.title || 'New Notification', {
        description: data.message,
        icon: '🔔',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      // Here you could also update a global state or trigger a refetch of unread notifications
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from notification server');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [session]);

  // Re-join room if session user ID changes while socket is connected
  useEffect(() => {
    if (socket && socket.connected && session?.user?.id) {
      socket.emit('join', session.user.id);
    }
  }, [socket, session?.user?.id]);

  return (
    <NotificationContext.Provider value={{ socket }}>
      {children}
      <Toaster position="bottom-right" />
    </NotificationContext.Provider>
  );
}
