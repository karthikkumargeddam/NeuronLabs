"use client";
import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';

export default function RazorpayCheckout({ amount, userEmail, className, children }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Order
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
      const orderRes = await fetch(`${strapiUrl}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }) // amount in INR
      });
      const order = await orderRes.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount, 
        currency: order.currency,
        name: "NeuronLabs",
        description: "NeuronLabs Pro Access",
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyRes = await fetch(`${strapiUrl}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              user_email: userEmail
            })
          });
          
          if (verifyRes.ok) {
            await update({ isPro: true });
            // Force a hard reload to clear Next.js aggressive client-side cache
            window.location.href = '/dashboard';
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: "#0a0a0a", // Dark mode accent
          backdrop_color: "#000000"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong loading the payment gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className={className || "inline-block bg-[#0f9d58] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0c8249] transition-all hover:scale-105 shadow-[0_0_20px_rgba(15,157,88,0.4)] disabled:opacity-50"}
      >
        {loading ? 'Securely Connecting...' : (children || `Unlock Pro Access - ₹${amount}`)}
      </button>
    </>
  );
}
