"use client";

import { useRouter } from "next/navigation";
import { sendGTMEvent } from '@next/third-parties/google';

export default function CheckoutButton({ amount, planName, className }) {
  const router = useRouter();

  const handleCheckout = () => {
    // Send conversion event to Google Analytics / Ads
    sendGTMEvent({ event: 'begin_checkout', value: { planName, amount } });
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', { 'send_to': 'AW-XXXXXXXXX/checkout_initiated' });
    }

    // Navigate to dedicated checkout page
    const slug = planName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/checkout/${slug}`);
  };

  return (
    <button 
      onClick={handleCheckout} 
      className={className || "w-full py-4 rounded-full font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 transition-all"}
    >
      Upgrade Now
    </button>
  );
}
