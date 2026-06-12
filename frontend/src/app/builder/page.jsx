"use client";

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

import { DatasetNode, PreprocessNode, TrainNode, EvaluateNode } from '@/components/CustomNodes';
import GlobalNav from '@/components/GlobalNav';
import { Play, Download, Save, Settings } from 'lucide-react';

const initialNodes = [
  { 
    id: '1', 
    type: 'datasetNode', 
    position: { x: 50, y: 150 }, 
    data: { status: 'success', parameters: { source: 'COCO 2017', split: 'train' } } 
  },
  { 
    id: '2', 
    type: 'preprocessNode', 
    position: { x: 450, y: 150 }, 
    data: { status: 'success', parameters: { method: 'resize (224x224)', normalize: 'true' } } 
  },
  { 
    id: '3', 
    type: 'trainNode', 
    position: { x: 850, y: 150 }, 
    data: { status: 'running', parameters: { model: 'ResNet50', epochs: '100', batchSize: '64' } } 
  },
  { 
    id: '4', 
    type: 'evaluateNode', 
    position: { x: 1250, y: 150 }, 
    data: { status: 'idle', parameters: { metric: 'mAP', subset: 'val' } } 
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#22d3ee', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', animated: false, style: { stroke: '#475569', strokeWidth: 2 } },
];

export default function BuilderPage() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const nodeTypes = useMemo(() => ({
    datasetNode: DatasetNode,
    preprocessNode: PreprocessNode,
    trainNode: TrainNode,
    evaluateNode: EvaluateNode,
  }), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#22d3ee', strokeWidth: 2 } }, eds)),
    []
  );

  const handleSave = async () => {
    try {
      const payload = {
        data: {
          name: 'Untitled_Pipeline_01',
          nodes,
          edges
        }
      };
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/pipelines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('Pipeline saved to Strapi successfully!');
      } else {
        alert('Failed to save pipeline');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving pipeline');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#030303] text-white overflow-hidden font-sans">
      <GlobalNav />
      
      {/* Header/Toolbar */}
      <div className="h-16 border-b border-white/10 mt-16 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="text-cyan-400">Visual</span> Builder
          </div>
          <div className="h-4 w-px bg-white/20 mx-2"></div>
          <div className="text-sm font-mono text-neutral-400">Untitled_Pipeline_01</div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium text-neutral-300">
            <Save className="w-4 h-4" /> Save
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors text-sm font-medium text-indigo-400">
            <Download className="w-4 h-4" /> Export as Python
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <Play className="w-4 h-4" /> Run Pipeline
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-grow relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#030303]"
        >
          <Background color="#222" gap={16} size={1} />
          <Controls className="bg-neutral-900 border border-white/10 text-white fill-white shadow-2xl rounded-lg overflow-hidden" />
          <MiniMap 
            nodeColor={(n) => {
              if (n.type === 'datasetNode') return '#22d3ee';
              if (n.type === 'preprocessNode') return '#a855f7';
              if (n.type === 'trainNode') return '#f43f5e';
              return '#10b981';
            }}
            maskColor="rgba(0, 0, 0, 0.8)"
            className="bg-neutral-900 border border-white/10 rounded-lg shadow-2xl"
          />
          
          <Panel position="top-left" className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col gap-3 m-4">
            <h4 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider mb-2">Node Library</h4>
            
            <div className="flex items-center gap-3 p-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 cursor-grab hover:bg-cyan-500/10 transition-colors">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
              <span className="text-sm font-medium text-cyan-100">Dataset</span>
            </div>
            
            <div className="flex items-center gap-3 p-2 rounded-lg border border-purple-500/20 bg-purple-500/5 cursor-grab hover:bg-purple-500/10 transition-colors">
              <div className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
              <span className="text-sm font-medium text-purple-100">Preprocess</span>
            </div>
            
            <div className="flex items-center gap-3 p-2 rounded-lg border border-rose-500/20 bg-rose-500/5 cursor-grab hover:bg-rose-500/10 transition-colors">
              <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
              <span className="text-sm font-medium text-rose-100">Model Train</span>
            </div>
            
            <div className="flex items-center gap-3 p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 cursor-grab hover:bg-emerald-500/10 transition-colors">
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
              <span className="text-sm font-medium text-emerald-100">Evaluate</span>
            </div>

          </Panel>

          <Panel position="bottom-right" className="m-4">
             <button className="w-12 h-12 bg-neutral-900 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shadow-2xl">
                <Settings className="w-5 h-5" />
             </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
