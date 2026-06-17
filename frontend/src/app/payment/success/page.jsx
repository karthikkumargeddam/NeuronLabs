"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Force Next.js to invalidate client router cache and refetch server components
    // so that the Homepage and Dashboard instantly reflect the new Pro status.
    router.refresh();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] text-white p-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-gray-800/80 bg-gradient-to-b from-[#111] to-[#050505] text-center shadow-[0_0_30px_rgba(34,197,94,0.15)] animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-6 border border-green-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        
        <h1 className="text-3xl font-black mb-2">Payment Successful!</h1>
        <p className="text-gray-400 mb-8">Thank you for your purchase. We have received your payment and are setting up your workspace.</p>
        
        <div className="flex flex-col gap-4">
          <Link href="/courses" className="w-full py-4 rounded-full font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 transition-all block">
            Go to Your Courses
          </Link>
          <Link href="/" className="w-full py-3 rounded-full font-bold border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors block">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
