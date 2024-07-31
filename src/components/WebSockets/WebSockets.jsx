import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_WS_URL);

const WebSockets = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
    });
    socket.on('1', (data) => {
      console.log('New entry received:', data);
      // Handle the new entry data
    });
    socket.on('new-entry', (data) => {
      console.log('New entry received:', data);
      // Handle the new entry data
    });

    socket.on('broadcast-message', (data) => {
      console.log('Broadcast message received:', data);
      // Handle the broadcast message
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    // Cleanup on component unmount
    return () => {
      socket.off('new-entry');
      socket.off('broadcast-message');
      socket.off('disconnect');
    };
  }, []);

  return null;
};

export default WebSockets;

