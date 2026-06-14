"use client";

import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false });
const FeedbackWidget = dynamic(() => import("./FeedbackWidget"), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <Chatbot />
      <FeedbackWidget />
    </>
  );
}
