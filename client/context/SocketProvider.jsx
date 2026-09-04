"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
        withCredentials: true,
        reconnection: true,
      });

      socketInstance.on("connect", () => {
        console.log("Connected to WebSocket Server:", socketInstance.id);
      });

      // socketInstance.on("notification", (data) => {
      //   toast.success(data.message, {
      //     duration: 5000,
      //     position: "bottom-left",
      //     style: {
      //       background: "#333",
      //       color: "#fff",
      //       borderRadius: "8px",
      //     },
      //   });
      // });

      socketInstance.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err.message);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else if (!user && socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [user, isLoading]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
