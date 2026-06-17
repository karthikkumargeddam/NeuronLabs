"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CourseContext = createContext();

export function CourseProvider({ children, courseId, totalModules }) {
  const [completedModules, setCompletedModules] = useState([]);

  useEffect(() => {
    // Load from local storage on mount
    if (courseId) {
      const saved = localStorage.getItem(`neuron_course_progress_${courseId}`);
      if (saved) {
        setCompletedModules(JSON.parse(saved));
      }
    }
  }, [courseId]);

  const markComplete = (index) => {
    setCompletedModules((prev) => {
      if (prev.includes(index)) return prev;
      const next = [...prev, index];
      localStorage.setItem(`neuron_course_progress_${courseId}`, JSON.stringify(next));
      return next;
    });
  };

  const isCompleted = (index) => completedModules.includes(index);
  const isCourseComplete = completedModules.length === totalModules && totalModules > 0;

  return (
    <CourseContext.Provider value={{ completedModules, markComplete, isCompleted, isCourseComplete, totalModules }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourseProgress() {
  return useContext(CourseContext);
}
