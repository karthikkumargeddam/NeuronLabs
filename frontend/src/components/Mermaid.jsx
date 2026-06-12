"use client";

import React, { useEffect } from "react";
import mermaid from "mermaid";

export default function Mermaid({ chart }) {
  if (!chart) return null;

  const cleanChart = chart.replace(/\\n/g, '\n').trim();
  // Safe HTML encoding for insertion into iframe
  const safeChart = cleanChart.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
      <style>
        body { 
          margin: 0; 
          padding: 0;
          display: flex; 
          justify-content: center; 
          align-items: center; 
          background: transparent; 
          min-height: 100%; 
          color: #fff; 
          font-family: monospace; 
        }
        .mermaid { 
          display: flex; 
          justify-content: center; 
          width: 100%;
        }
        svg {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      <div class="mermaid">
        ${safeChart}
      </div>
      <script>
        document.addEventListener("DOMContentLoaded", () => {
          mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' });
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="flex justify-center p-2 bg-[#050505] rounded-xl shadow-inner w-full h-full overflow-hidden">
      <iframe 
        srcDoc={htmlContent} 
        className="w-full h-full border-0"
        title="Architecture Diagram"
        sandbox="allow-scripts"
      />
    </div>
  );
}
