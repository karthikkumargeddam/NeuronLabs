"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Award, BookOpen, MessageSquare, Flame } from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      setUnreadCount(0); // Mark as read when opening
    }
  };

  const notifications = [
    {
      id: 1,
      type: "achievement",
      icon: Award,
      title: "Achievement Unlocked!",
      description: "You earned the 'Data Explorer' badge.",
      time: "2 mins ago",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      link: "/achievements"
    },
    {
      id: 2,
      type: "course",
      icon: BookOpen,
      title: "New Course Available",
      description: "Advanced Neural Networks by Dr. Alan Turing is now live.",
      time: "1 hour ago",
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
      link: "/courses"
    },
    {
      id: 3,
      type: "community",
      icon: MessageSquare,
      title: "New Answer",
      description: "alex_ml replied to your question about CUDA OOM.",
      time: "3 hours ago",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      link: "/community"
    },
    {
      id: 4,
      type: "streak",
      icon: Flame,
      title: "3 Day Streak!",
      description: "You're on fire! Keep coding to maintain your streak.",
      time: "1 day ago",
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      link: "/dashboard"
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleOpen}
        className="relative p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0a0a0a]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#141414]">
            <h3 className="font-bold text-white">Notifications</h3>
            <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              Mark all as read
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.map((notification) => (
              <Link 
                href={notification.link} 
                key={notification.id}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <div className={`p-2 rounded-full \${notification.bg} shrink-0`}>
                  <notification.icon className={`w-5 h-5 \${notification.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors truncate pr-2">
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-neutral-500 whitespace-nowrap shrink-0">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {notification.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-2 border-t border-white/10 bg-[#111]">
            <button className="w-full py-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
