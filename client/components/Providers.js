"use client";

import GoogleAuthProvider from "./GoogleAuthProvider";
import { AuthProvider } from "../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SubscribtionProvider } from "@/context/SubscribtionProvider";
import { SocketProvider } from "../context/SocketProvider";


const queryClient = new QueryClient()

export default function Providers({ children }) {
  return (
    <GoogleAuthProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscribtionProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </SubscribtionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleAuthProvider>
  );
}
