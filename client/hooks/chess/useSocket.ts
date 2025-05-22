import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';

// Use different host addresses based on platform
export const getServerUrl = () => {
  // Your computer's IP address on the local network
  const LOCAL_IP = '192.168.228.32';
  const PORT = '5000';
  
  let serverUrl = '';
  
  if (Platform.OS === 'web') {
    // For web, we can use localhost
    serverUrl = 'http://localhost:5000';
  } else if (Platform.OS === 'android') {
    // For Android emulator
    if (__DEV__ && false) { // Set to true when using emulator
      serverUrl = 'http://10.0.2.2:5000';
    } else {
      // For physical devices or testing on the same network
      serverUrl = `http://${LOCAL_IP}:${PORT}`;
    }
  } else if (Platform.OS === 'ios') {
    // For iOS simulator
    if (__DEV__ && false) { // Set to true when using simulator
      serverUrl = 'http://localhost:5000';
    } else {
      // For physical devices or testing on the same network
      serverUrl = `http://${LOCAL_IP}:${PORT}`;
    }
  } else {
    // For other platforms
    serverUrl = `http://${LOCAL_IP}:${PORT}`;
  }
  
  console.log(`Platform: ${Platform.OS}, Server URL: ${serverUrl}`);
  return serverUrl;
};

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const serverUrl = getServerUrl();
    console.log(`Connecting to socket at: ${serverUrl}`);
    
    const socket = io(serverUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected!');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected!');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Function to emit events
  const emit = <T>(event: string, data: T) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  // Function to subscribe to events
  const on = <T>(event: string, callback: (data: T) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
    // Return unsubscribe function
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
  };
}; 