"use client";

import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./NotificationProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SessionProvider>
        <NotificationProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'font-mono text-sm',
              style: {
                background: '#111',
                color: '#fff',
                border: '1px solid #333',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#111',
                },
              },
            }}
          />
          {children}
        </NotificationProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
