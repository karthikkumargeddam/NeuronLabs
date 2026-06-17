"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const access_token = searchParams.get('access_token') || searchParams.get('jwt');
  const error_param = searchParams.get('error');

  useEffect(() => {
    if (error_param) {
      router.push(`/auth/signin?error=${encodeURIComponent(error_param)}`);
      return;
    }

    if (access_token) {
      // Test the token directly from the client to see what Strapi says!
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/users/me?populate=*`, {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: 'no-store'
      })
      .then(res => {
        if (!res.ok) throw new Error(`Strapi returned ${res.status}`);
        return res.json();
      })
      .then(user => {
        console.log("Strapi token is valid! User:", user);
        // Pass the Strapi JWT to NextAuth Credentials provider
        return signIn('credentials', {
          access_token,
          redirect: false,
        });
      })
      .then((res) => {
        if (res?.error) {
          console.error("Failed to sign in with NextAuth:", res.error);
          router.push(`/auth/signin?error=${encodeURIComponent(res.error)}`);
        } else if (res) {
          // Success! Redirect to dashboard
          window.location.href = '/dashboard';
        }
      })
      .catch(err => {
        console.error("Direct Strapi fetch failed:", err);
        router.push(`/auth/signin?error=${encodeURIComponent("ClientStrapiError_" + err.message)}`);
      });
    } else {
      router.push(`/auth/signin?error=MissingToken_${encodeURIComponent(window.location.search)}`);
    }
  }, [access_token, error_param, router]);

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
        <h2 className="text-xl text-white font-mono">Authenticating with Google...</h2>
        <p className="text-gray-400 mt-2">Please wait while we set up your session.</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
