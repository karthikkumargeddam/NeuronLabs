"use client";

import { useState } from "react";
import GlobalNav from "@/components/GlobalNav";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { Upload, FileCode2, Play, AlertCircle } from "lucide-react";

export default function NotebookViewerPage() {
  const [notebookData, setNotebookData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.ipynb')) {
      setError("Please upload a valid Jupyter Notebook (.ipynb) file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json.cells) throw new Error("Invalid notebook format");
        setNotebookData(json);
        setError(null);
      } catch (err) {
        setError("Failed to parse notebook JSON. Is the file corrupted?");
      }
    };
    reader.readAsText(file);
  };

  const renderCell = (cell, index) => {
    if (cell.cell_type === "markdown") {
      const source = Array.isArray(cell.source) ? cell.source.join("") : cell.source;
      return (
        <div key={index} className="px-8 py-6 text-neutral-300 prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {source}
          </ReactMarkdown>
        </div>
      );
    }

    if (cell.cell_type === "code") {
      const source = Array.isArray(cell.source) ? cell.source.join("") : cell.source;
      return (
        <div key={index} className="my-4 border border-white/10 rounded-xl overflow-hidden bg-[#0f0f0f]">
          <div className="flex bg-[#161616] border-b border-white/5 px-4 py-2 items-center gap-4">
            <span className="text-xs font-mono text-cyan-500 font-bold">
              In [{cell.execution_count || " "}]:
            </span>
            <div className="flex-1"></div>
            <button className="text-neutral-500 hover:text-cyan-400 transition-colors">
              <Play className="w-4 h-4" />
            </button>
          </div>
          <div className="px-8 py-4 bg-[#0a0a0a]">
            <pre className="font-mono text-sm text-neutral-200 overflow-x-auto">
              <code>{source}</code>
            </pre>
          </div>
          
          {cell.outputs && cell.outputs.length > 0 && (
            <div className="px-8 py-4 bg-[#111] border-t border-white/5">
              {cell.outputs.map((output, outIdx) => {
                if (output.output_type === "stream") {
                  return (
                    <pre key={outIdx} className="text-sm font-mono text-neutral-400 whitespace-pre-wrap">
                      {Array.isArray(output.text) ? output.text.join("") : output.text}
                    </pre>
                  );
                }
                if (output.output_type === "execute_result" || output.output_type === "display_data") {
                  const data = output.data;
                  if (data["image/png"]) {
                    return <img key={outIdx} src={`data:image/png;base64,${data["image/png"]}`} alt="cell output" className="max-w-full rounded" />;
                  }
                  if (data["text/html"]) {
                    return <div key={outIdx} dangerouslySetInnerHTML={{ __html: Array.isArray(data["text/html"]) ? data["text/html"].join("") : data["text/html"] }} />;
                  }
                  if (data["text/plain"]) {
                    return (
                      <pre key={outIdx} className="text-sm font-mono text-emerald-400">
                        {Array.isArray(data["text/plain"]) ? data["text/plain"].join("") : data["text/plain"]}
                      </pre>
                    );
                  }
                }
                if (output.output_type === "error") {
                  return (
                    <pre key={outIdx} className="text-sm font-mono text-red-400">
                      {output.ename}: {output.evalue}
                      {"\n"}
                      {output.traceback.join("\n")}
                    </pre>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-cyan-500/30">
      <GlobalNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-sm text-fuchsia-400 mb-6">
            <FileCode2 className="w-4 h-4" />
            Data Science Tooling
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Notebook Viewer
          </h1>
          <p className="text-neutral-400 text-lg">
            Upload your Jupyter <code className="text-fuchsia-400">.ipynb</code> files to render them natively in the browser. Perfect for reviewing data science assignments.
          </p>
        </div>

        {!notebookData && (
          <div className="w-full max-w-2xl mx-auto border-2 border-dashed border-white/10 hover:border-fuchsia-500/50 bg-[#0a0a0a] rounded-3xl p-12 text-center transition-all group">
            <div className="w-16 h-16 bg-fuchsia-500/10 text-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Upload Notebook</h3>
            <p className="text-neutral-500 mb-8">Drag and drop your .ipynb file here, or click to browse.</p>
            <label className="cursor-pointer bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-neutral-200 transition-colors">
              Select File
              <input type="file" accept=".ipynb" className="hidden" onChange={handleFileUpload} />
            </label>
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </div>
        )}

        {notebookData && (
          <div className="bg-[#050505] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#111] border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCode2 className="w-5 h-5 text-fuchsia-400" />
                <span className="font-mono text-sm font-bold text-neutral-300">
                  {notebookData.metadata?.kernelspec?.display_name || "Python 3"} Notebook
                </span>
              </div>
              <button 
                onClick={() => setNotebookData(null)}
                className="text-xs font-bold text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded"
              >
                Close Notebook
              </button>
            </div>
            
            <div className="p-2 md:p-6 bg-white/[0.02]">
              {notebookData.cells.map((cell, idx) => renderCell(cell, idx))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
