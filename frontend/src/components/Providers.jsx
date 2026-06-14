"use client";

import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./NotificationProvider";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SessionProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
