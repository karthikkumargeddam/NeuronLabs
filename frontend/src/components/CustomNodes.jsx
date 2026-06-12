import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database, Play, CheckCircle, DatabaseZap, BoxSelect } from 'lucide-react';

const BaseNode = ({ id, data, icon: Icon, title, description, colorClass, borderClass, bgClass, handles }) => {
  return (
    <div className={`relative min-w-[280px] rounded-2xl border ${borderClass} ${bgClass} p-5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
      {/* Handles map */}
      {handles.map((h, i) => (
        <Handle
          key={i}
          type={h.type}
          position={h.position}
          id={h.id}
          className={`w-3 h-3 ${colorClass} border-2 border-neutral-900 bg-current transition-transform hover:scale-150`}
        />
      ))}
      
      {/* Node Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl bg-neutral-900 border ${borderClass}`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
            {data.status === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {data.status === 'running' && <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>}
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">{description}</p>
        </div>
      </div>
      
      {/* Node Content / Controls (placeholder for future form inputs) */}
      <div className="bg-neutral-900/50 rounded-lg p-3 border border-white/5 font-mono text-xs text-neutral-300">
        {data.parameters ? Object.entries(data.parameters).map(([k, v]) => (
          <div key={k} className="flex justify-between mb-1 last:mb-0">
            <span className="text-neutral-500">{k}:</span>
            <span className="text-cyan-400">{v}</span>
          </div>
        )) : <span className="text-neutral-600 italic">No parameters required</span>}
      </div>
    </div>
  );
};

export const DatasetNode = ({ data, id }) => (
  <BaseNode 
    id={id}
    data={data}
    icon={Database}
    title="Load Dataset"
    description="Imports data into the pipeline"
    colorClass="text-cyan-400"
    borderClass="border-cyan-500/30"
    bgClass="bg-[#05101a]/90"
    handles={[
      { type: 'source', position: Position.Right, id: 'out' }
    ]}
  />
);

export const PreprocessNode = ({ data, id }) => (
  <BaseNode 
    id={id}
    data={data}
    icon={BoxSelect}
    title="Data Preprocessor"
    description="Transforms and cleanses data"
    colorClass="text-purple-400"
    borderClass="border-purple-500/30"
    bgClass="bg-[#10051a]/90"
    handles={[
      { type: 'target', position: Position.Left, id: 'in' },
      { type: 'source', position: Position.Right, id: 'out' }
    ]}
  />
);

export const TrainNode = ({ data, id }) => (
  <BaseNode 
    id={id}
    data={data}
    icon={Play}
    title="Model Training"
    description="Trains model on GPU cluster"
    colorClass="text-rose-400"
    borderClass="border-rose-500/30"
    bgClass="bg-[#1a0505]/90"
    handles={[
      { type: 'target', position: Position.Left, id: 'in' },
      { type: 'source', position: Position.Right, id: 'out' }
    ]}
  />
);

export const EvaluateNode = ({ data, id }) => (
  <BaseNode 
    id={id}
    data={data}
    icon={DatabaseZap}
    title="Evaluation Metrics"
    description="Calculates accuracy, F1, Loss"
    colorClass="text-emerald-400"
    borderClass="border-emerald-500/30"
    bgClass="bg-[#051a0f]/90"
    handles={[
      { type: 'target', position: Position.Left, id: 'in' }
    ]}
  />
);
