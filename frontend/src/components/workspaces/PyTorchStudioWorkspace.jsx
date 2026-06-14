"use client";

import React, { useState } from "react";

export default function PyTorchStudioWorkspace() {
  const [epoch] = useState(14);
  const [lr, setLr] = useState("0.001");

  return (
    <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden bg-[#0c0c0e] rounded-lg border border-[#2a2a35] shadow-2xl p-4 text-gray-300">
      
      {/* Left Panel: Model Architecture */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="bg-[#14141a] rounded-xl border border-[#2a2a35] flex flex-col flex-grow">
          <div className="p-4 border-b border-[#2a2a35] flex justify-between items-center bg-[#1c1c24] rounded-t-xl">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="text-[#ee4c2c]">🔥</span> Model Graph
            </h3>
            <span className="text-xs bg-[#2a2a35] px-2 py-1 rounded text-gray-400">ResNet-50</span>
          </div>
          <div className="flex-grow p-4 overflow-y-auto space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#1c1c24] border border-[#2a2a35] rounded-lg border-l-2 border-l-blue-500 hover:bg-[#2a2a35] transition-colors cursor-pointer">
              <div className="text-blue-400 font-bold mb-1">Conv2d(3, 64, kernel_size=(7, 7), stride=(2, 2))</div>
              <div className="text-gray-500">Parameters: 9,408</div>
            </div>
            <div className="flex justify-center text-gray-600">↓</div>
            <div className="p-3 bg-[#1c1c24] border border-[#2a2a35] rounded-lg border-l-2 border-l-purple-500 hover:bg-[#2a2a35] transition-colors cursor-pointer">
              <div className="text-purple-400 font-bold mb-1">BatchNorm2d(64, eps=1e-05)</div>
              <div className="text-gray-500">Parameters: 128</div>
            </div>
            <div className="flex justify-center text-gray-600">↓</div>
            <div className="p-3 bg-[#1c1c24] border border-[#2a2a35] rounded-lg border-l-2 border-l-green-500 hover:bg-[#2a2a35] transition-colors cursor-pointer">
              <div className="text-green-400 font-bold mb-1">ReLU(inplace=True)</div>
              <div className="text-gray-500">Parameters: 0</div>
            </div>
            <div className="flex justify-center text-gray-600">↓</div>
            <div className="p-3 bg-[#1c1c24] border border-[#2a2a35] rounded-lg border-l-2 border-l-yellow-500 hover:bg-[#2a2a35] transition-colors cursor-pointer opacity-50">
              <div className="text-yellow-400 font-bold mb-1">MaxPool2d(kernel_size=3, stride=2, padding=1)</div>
              <div className="text-gray-500">...</div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Panel: Training Console */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="bg-[#14141a] rounded-xl border border-[#2a2a35] flex flex-col flex-grow">
          <div className="p-4 border-b border-[#2a2a35] flex justify-between items-center bg-[#1c1c24] rounded-t-xl">
            <h3 className="font-bold text-white">Live Training</h3>
            <div className="flex gap-2">
              <button className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-xs font-bold hover:bg-red-500/30">Stop</button>
              <button className="bg-[#ee4c2c] text-white px-3 py-1 rounded text-xs font-bold shadow-[0_0_15px_rgba(238,76,44,0.4)]">Pause</button>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center border-b border-[#2a2a35]">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2a2a35" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#ee4c2c" strokeWidth="10" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * 0.65)} className="transition-all duration-1000" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-white">Epoch</span>
                <span className="text-3xl text-[#ee4c2c] font-black">{epoch}/50</span>
              </div>
            </div>
          </div>
          
          <div className="flex-grow p-4 bg-black/40 overflow-y-auto font-mono text-[11px] leading-relaxed text-[#00ff00]">
            <div>[INFO] Loading dataset (CIFAR-10) onto GPU:0... OK</div>
            <div>[INFO] Starting mixed precision training loop.</div>
            <div className="mt-2 text-gray-400">Epoch 12/50: loss=0.4512, acc=86.2%</div>
            <div className="text-gray-400">Epoch 13/50: loss=0.4201, acc=87.5%</div>
            <div className="mt-2 font-bold text-white bg-white/10 inline-block px-1">Epoch 14/50: loss=0.3890, acc=88.1% [BATCH 450/1500]</div>
            <div className="mt-1 flex items-center gap-2">
              <div className="w-full h-1 bg-[#2a2a35] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-[30%]"></div>
              </div>
              <span className="text-gray-500">30%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Metrics & Hyperparameters */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        {/* Hardware Status */}
        <div className="bg-[#14141a] rounded-xl border border-[#2a2a35] p-4">
          <h3 className="font-bold text-white text-sm mb-4 border-b border-[#2a2a35] pb-2">Hardware Acceleration</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">NVIDIA A100-SXM4 (GPU:0)</span>
                <span className="text-[#ee4c2c] font-mono">98%</span>
              </div>
              <div className="h-1.5 w-full bg-[#2a2a35] rounded-full overflow-hidden">
                <div className="h-full bg-[#ee4c2c] w-[98%] shadow-[0_0_10px_#ee4c2c]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">VRAM Usage</span>
                <span className="text-cyan-400 font-mono">32GB / 40GB</span>
              </div>
              <div className="h-1.5 w-full bg-[#2a2a35] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-[80%]"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-mono">
              <span>Temp: 78°C</span>
              <span>Pwr: 380W</span>
            </div>
          </div>
        </div>

        {/* Hyperparameters */}
        <div className="bg-[#14141a] rounded-xl border border-[#2a2a35] p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-white text-sm mb-4 border-b border-[#2a2a35] pb-2">Hyperparameters</h3>
          <div className="space-y-4 flex-grow">
            <div>
              <label className="text-xs text-gray-400 flex justify-between mb-1">
                <span>Learning Rate</span>
                <span className="font-mono text-white">{lr}</span>
              </label>
              <input 
                type="range" 
                min="0.0001" max="0.1" step="0.0001" 
                value={lr} 
                onChange={(e) => setLr(e.target.value)}
                className="w-full accent-[#ee4c2c]" 
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 flex justify-between mb-1">
                <span>Batch Size</span>
                <span className="font-mono text-white">256</span>
              </label>
              <select defaultValue="256" className="w-full bg-[#1c1c24] border border-[#2a2a35] rounded p-1 text-sm text-white outline-none">
                <option>64</option>
                <option>128</option>
                <option>256</option>
                <option>512</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 flex justify-between mb-1">
                <span>Optimizer</span>
                <span className="font-mono text-white">AdamW</span>
              </label>
            </div>
          </div>
          <button className="w-full py-2 bg-[#2a2a35] hover:bg-[#3a3a45] rounded-lg text-white font-semibold text-sm transition-colors border border-[#444]">
            Update Parameters
          </button>
        </div>
      </div>

    </div>
  );
}
