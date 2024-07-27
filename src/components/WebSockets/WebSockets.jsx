import React, { useEffect, useState } from 'react'

import { io } from 'socket.io-client';
export const socket = io(`${process.env.REACT_APP_WS_URL}`);

const WebSockets = () => {
  const [message, setMessage] = useState('');
  console.log("🚀 ~ WebSockets ~ message:", message)

  useEffect(() => {
    socket.on('new-entry', (data) => {
      console.log('Received message from server:', data);
      setMessage(data.message);
      // Handle or display the received data
    });

    return () => {
      socket.off('new-entry'); // Cleanup listener on component unmount
    };
  }, []);
  return null;
}

export default WebSockets
