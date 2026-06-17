"use client";

import { sendGTMEvent } from '@next/third-parties/google';
import { useSession } from 'next-auth/react';
import RazorpayCheckout from './RazorpayCheckout';

export default function CheckoutButton({ amount, planName, className }) {
  const { data: session } = useSession();

  const handleCheckout = () => {
    // Send conversion event to Google Analytics / Ads
    sendGTMEvent({ event: 'begin_checkout', value: { planName, amount } });
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', { 'send_to': 'AW-XXXXXXXXX/checkout_initiated' });
    }
  };

  if (!session) {
    return (
      <button 
        onClick={() => {
          handleCheckout();
          window.location.href = '/auth/signin';
        }}
        className={className || "w-full py-4 rounded-full font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 transition-all"}
      >
        Sign in to Upgrade
      </button>
    );
  }

  if (session?.user?.isPro) {
    return (
      <button 
        disabled
        className={className || "w-full py-4 rounded-full font-bold bg-gray-800 text-gray-400 shadow-none cursor-not-allowed"}
      >
        Already a Pro Member
      </button>
    );
  }

  return (
    <div onClick={handleCheckout} className="w-full">
      <RazorpayCheckout 
        amount={amount} 
        userEmail={session.user?.email} 
        className={className || "w-full py-4 rounded-full font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 transition-all"}
      >
        Upgrade Now
      </RazorpayCheckout>
    </div>
  );
}
