"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

export default function PaymentPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upiId = "kartikfiitjee68-5@okicici";
  const amount = 1;
  const upiUrl = `upi://pay?pa=${upiId}&pn=NeuronLabs&am=${amount}&cu=INR`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId || transactionId.length < 8) {
      setError("Please enter a valid UPI transaction ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.jwt}`,
        },
        body: JSON.stringify({
          transactionId,
          amount,
          userId: session?.user?.id || session?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update session so the UI instantly knows the user is Pro
        await update({ isPro: true });
        router.push("/payment/success");
      } else {
        setError(data.error?.message || "Verification failed. Please check your transaction ID.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {session?.user?.isPro ? (
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-green-500/30 bg-[#0a0a0a]/80 text-center shadow-[0_0_30px_rgba(34,197,94,0.15)] z-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-6 border border-green-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Already a Pro Member</h2>
          <p className="text-gray-400 mb-8 font-medium">Your account already has an active Pro subscription.</p>
          <button 
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 rounded-xl font-bold bg-gray-800 text-white hover:bg-gray-700 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 z-10">
        
        {/* Left Side: QR Code */}
        <div className="glass-panel p-10 rounded-3xl border border-gray-800/80 bg-[#0a0a0a]/80 flex flex-col items-center justify-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full text-sm font-mono shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Awaiting Payment
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2">₹{amount}</h2>
          <p className="text-gray-400 mb-8 font-medium">Scan with any UPI App to activate Pro Plan</p>
          
          <div className="bg-white p-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] inline-block mb-6">
            <QRCode value={upiUrl} size={256} className="w-64 h-64" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="glass-panel p-10 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-[#0a0a0a] flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-white mb-2">Verify Transaction</h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            After completing the payment via the QR code, please enter your 12-digit UPI Transaction ID (UTR) below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">UPI Transaction ID / UTR</label>
              <input
                type="text"
                placeholder="e.g. 3145XXXXXXXX"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full bg-[#111] border border-gray-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-lg placeholder:text-gray-600"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !session}
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Submit Verification"
              )}
            </button>
          </form>

          {!session && (
            <p className="mt-4 text-amber-400 text-sm font-medium text-center">
              Please initialize your session (sign in) to complete payment.
            </p>
          )}
        </div>

        </div>
      )}
    </div>
  );
}
