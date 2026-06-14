"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useNotifications } from "../../../components/NotificationProvider";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { data: session, update } = useSession();
  const params = useParams();
  const router = useRouter();
  const { socket } = useNotifications();
  
  const isPro = params.slug === 'pro';
  const [activeMethod, setActiveMethod] = useState("qr"); // "razorpay" or "qr"
  
  // QR Verification State
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [paymentState, setPaymentState] = useState("idle"); // "idle" | "pending" | "approved"

  const planDetails = isPro ? {
    name: "NeuronLabs Pro Plan",
    features: [
      "Advanced Sandboxes",
      "Priority Support",
      "Full Curriculum Access",
      "50hrs GPU Acceleration"
    ],
    price: 299,
  } : {
    name: "Custom Plan",
    features: ["Custom Features"],
    price: 0,
  };

  const handleQRSubmit = async (e) => {
    e.preventDefault();
    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(transactionId)) {
      setError("Please enter exactly 12 numeric digits for the UTR.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Send Notification to Strapi Backend for Manual Telegram Verification
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.jwt}`,
        },
        body: JSON.stringify({
          transactionId,
          amount: planDetails.price,
          userId: session?.user?.id || session?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentState("pending"); // Hangs on pending until admin approves via Telegram
      } else {
        setError(data.error?.message || data.message || data.error || "Verification failed. Please check your transaction ID.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // WebSocket handler restored for real-time Telegram approval
  useEffect(() => {
    if (socket && paymentState === "pending") {
       const handler = async (data) => {
         console.log("🟢 SOCKET EVENT RECEIVED:", data);
         console.log("🟢 CURRENT TX ID:", transactionId);
         if (data.transactionId === transactionId) {
            if (data.status === 'approve' || data.status === 'approved') {
               console.log("🟢 APPROVED! Updating UI...");
               setPaymentState("approved"); // Set UI immediately
               try { 
                 await update({ isPro: true }); 
               } catch(e) {
                 console.error("Session update failed:", e);
               }
            } else if (data.status === 'reject' || data.status === 'rejected') {
               setPaymentState("idle");
               setError("Your payment was rejected by the administrator. Please try again or contact support.");
            }
         }
       };
       socket.on('payment_status_update', handler);
       return () => socket.off('payment_status_update', handler);
    }
  }, [socket, paymentState, transactionId, update]);

  if (paymentState === "pending") {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <div className="glass-panel p-10 rounded-3xl max-w-lg text-center border-yellow-500/30">
          <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Processing</h2>
          <p className="text-gray-400 mb-6 text-lg">We have received your UTR number: <span className="text-white font-mono">{transactionId}</span></p>
          <p className="text-gray-500 mb-8">Our team is verifying the transaction with the bank and upgrading your account to Pro.</p>
        </div>
      </div>
    );
  }

  if (paymentState === "approved") {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <div className="glass-panel p-10 rounded-3xl max-w-lg text-center border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
          <p className="text-gray-300 mb-8 text-lg">You are now in the Pro plan.</p>
          <button onClick={() => router.push('/dashboard')} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans pt-24">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-[#f26a3c]/10 via-indigo-500/10 to-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl w-full grid md:grid-cols-12 gap-8 z-10 animate-fade-in">
        
        {/* Left Side: Payment Options */}
        <div className="md:col-span-7 glass-panel p-8 md:p-10 rounded-3xl border border-gray-800/80 bg-[#0a0a0a]/80 shadow-2xl flex flex-col">
          <h2 className="text-3xl font-black text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
            Select a payment option
          </h2>

          <div className="space-y-4 flex-grow">
            
            {/* Option 1: UPI QR Code (Zero Fees) */}
            <div 
              onClick={() => setActiveMethod("qr")}
              className={`border rounded-2xl p-6 relative overflow-hidden transition-all cursor-pointer border-cyan-500 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-5 h-5 rounded-full mt-1 shrink-0 transition-colors border-[5px] border-cyan-500 bg-white`}></div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-1 text-white flex items-center gap-3`}>
                    Scan UPI QR Code
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-bold uppercase tracking-wider">0% Gateway Fee</span>
                  </h3>
                  <p className="text-gray-400 text-sm">Directly scan with GPay, PhonePe, Paytm, or BHIM.</p>

                  {activeMethod === "qr" && (
                    <div className="mt-6 animate-fade-in border-t border-gray-800 pt-6 flex flex-col md:flex-row gap-8">
                      {/* QR Display */}
                      <div className="bg-white p-4 rounded-2xl flex-shrink-0 mx-auto md:mx-0 w-fit">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=kartikfiitjee68-5@okicici&pn=NeuronLabs&am=${planDetails.price}.00&cu=INR`)}`} 
                          alt="UPI QR Code" 
                          className="w-48 h-auto"
                        />
                      </div>
                      
                      {/* UTR Form */}
                      <div className="flex-1">
                        <form onSubmit={handleQRSubmit} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Enter 12-Digit UTR Number</label>
                            <input
                              type="text"
                              placeholder="e.g. 314512345678"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              className="w-full bg-[#050505] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm placeholder:text-gray-600"
                            />
                          </div>
                          
                          {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg text-xs font-medium">
                              {error}
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={loading || !session}
                            className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                          >
                            {loading ? "Verifying..." : "Verify Payment"}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="md:col-span-5 glass-panel p-8 md:p-10 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#111] to-[#050505] shadow-2xl relative h-fit sticky top-24">
          <h2 className="text-2xl font-bold text-white mb-6">Confirm your order</h2>
          
          {/* User Preview */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl uppercase shadow-lg">
              {session?.user?.username?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="text-white font-medium">{session?.user?.username || 'Guest User'}</div>
              <div className="text-gray-500 text-sm">{session?.user?.email || 'Sign in to link account'}</div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="py-6 border-b border-gray-800 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <span className="text-cyan-400">⚡</span> {planDetails.name}
                </h3>
                <p className="text-gray-500 text-sm">Monthly Subscription</p>
              </div>
              <div className="text-xl font-bold text-white">₹{planDetails.price}</div>
            </div>

            <ul className="space-y-2 mt-4 text-sm text-gray-400">
              {planDetails.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Math */}
          <div className="py-6 space-y-3 border-b border-gray-800">
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Subtotal</span>
              <span>₹{planDetails.price}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Gateway transaction fee</span>
              <span className="text-emerald-400">Free</span>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex justify-between items-end mb-1">
              <span className="text-gray-300 font-medium text-lg">Total</span>
              <span className="text-3xl font-black text-white">₹{planDetails.price}</span>
            </div>
            <p className="text-right text-xs text-gray-500 mt-2">By proceeding, you agree to Razorpay's Terms of Service.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
