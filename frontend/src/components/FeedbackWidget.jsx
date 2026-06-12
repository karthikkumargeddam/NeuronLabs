"use client";

import { useState } from "react";
import { fetchAPI } from "../lib/api";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchAPI('/api/feedbacks', {}, {
        method: 'POST',
        body: JSON.stringify({ data: { rating, message: feedback } })
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFeedback("");
        setRating(0);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback', error);
      // Even if it fails, maybe let the user try again or show error (for simplicity, we just console error here)
    }
  };

  return (
    <>
      {/* Feedback Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-300"
        aria-label="Give Feedback"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        )}
      </button>

      {/* Feedback Form Popup */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="p-5 border-b border-gray-800 bg-gradient-to-r from-purple-500/10 to-transparent">
            <h3 className="text-white font-bold text-lg">Send Feedback</h3>
            <p className="text-gray-400 text-xs mt-1">Help us improve your experience</p>
          </div>

          <div className="p-5">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in duration-300">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <p className="text-white font-medium">Thank you!</p>
                <p className="text-gray-400 text-xs mt-1 text-center">Your feedback has been received.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Rating */}
                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2 block">Rate your experience</label>
                  <div className="flex justify-between px-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-all hover:scale-125 ${rating >= star ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400/50'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2 block">Tell us more</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="What do you think about Neuron Labs?"
                    className="w-full bg-black/50 border border-gray-800 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono resize-none h-24"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={!feedback.trim() || rating === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl py-2.5 text-sm font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
