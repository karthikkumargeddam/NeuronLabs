"use client";

import { useRouter } from "next/navigation";

export default function CheckoutButton({ amount, planName, className }) {
  const router = useRouter();

  const handleCheckout = () => {
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
