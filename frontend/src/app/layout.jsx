import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import Providers from "../components/Providers";
import GlobalNav from "../components/GlobalNav";
import Footer from "../components/Footer";
import AuthGuard from "../components/AuthGuard";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://neuronlabs.online"),
  title: "NeuronLabs | The Future of Tech Education",
  description: "Code, train, and deploy instantly in zero-setup virtual boxes.",
  keywords: ["Virtual Labs", "Coding Sandbox", "AI Mock Interviews", "GPU Cloud", "Tech Education", "Learn to Code"],
  authors: [{ name: "NeuronLabs" }],
  openGraph: {
    title: "NeuronLabs | The Future of Tech Education",
    description: "Code, train, and deploy instantly in zero-setup virtual boxes.",
    url: "https://neuronlabs.online",
    siteName: "Neuron Labs",
    images: [
      {
        url: "https://neuronlabs.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "NeuronLabs Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuronLabs | The Future of Tech Education",
    description: "Code, train, and deploy instantly in zero-setup virtual boxes.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  verification: {
    google: "FNz4HLWlEQgXlRDN78pK3-pVmxO7_bIIYSJrrv988ow",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Neuron Labs",
              "alternateName": "NeuronLabs",
              "url": "https://neuronlabs.online/"
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <GlobalNav />
          <main className="pt-[124px] flex-grow flex flex-col">
            <AuthGuard>
              {children}
            </AuthGuard>
          </main>
          <Footer />
        </Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
      </body>
    </html>
  );
}
