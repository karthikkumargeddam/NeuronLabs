"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function CourseDiscussions({ courseId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [courseId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:1337/api/comments/api::course.course:${courseId}`);
      if (res.ok) {
        const data = await res.json();
        // The plugin usually returns an array or paginated object, adapting standard format
        setComments(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (err) {
      console.error("Failed to load comments", err);
      setError("Failed to load discussions.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!session) {
      alert("Please sign in to join the discussion.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:1337/api/comments/api::course.course:${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.jwt}`,
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments(); // Refresh list
      } else {
        const data = await res.json();
        alert(data.error?.message || "Failed to post comment");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (loading) return <div className="text-gray-400 py-8">Loading discussions...</div>;

  return (
    <div className="mt-12 bg-[#0a0a0a] rounded-2xl border border-gray-800 p-6 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Course Discussions
      </h3>

      {/* New Comment Input */}
      <form onSubmit={handlePostComment} className="mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
            {session?.user?.username?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={session ? "Ask a question or share your thoughts..." : "Sign in to join the discussion"}
              className="w-full bg-[#111] border border-gray-800 text-white rounded-xl p-4 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none min-h-[100px]"
              disabled={!session}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={!session || !newComment.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8 border border-dashed border-gray-800 rounded-xl">No discussions yet. Be the first to start!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold shrink-0">
                {comment.authorUser?.username?.charAt(0) || "A"}
              </div>
              <div className="flex-1 bg-[#111] rounded-2xl rounded-tl-none p-4 border border-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-200">
                    {comment.authorUser?.username || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-600">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
