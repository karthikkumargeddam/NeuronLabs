"use client";

import { useSession } from "next-auth/react";

export default function ConditionalPricing({ children }) {
  const { data: session } = useSession();
  
  // If user is logged in and is Pro, hide the pricing section
  if (session?.user?.isPro) {
    return null;
  }
  
  return <>{children}</>;
}
