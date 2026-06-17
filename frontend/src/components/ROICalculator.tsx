import React, { useState } from 'react';

export default function ROICalculator() {
  const [interactions, setInteractions] = useState(1000);
  const [humanCost, setHumanCost] = useState(4.50);
  const [aiCost, setAiCost] = useState(0.05);
  const [deflectionRate, setDeflectionRate] = useState(65);

  const totalHumanCost = interactions * humanCost;
  const deflectedInteractions = Math.floor(interactions * (deflectionRate / 100));
  const humanInteractions = interactions - deflectedInteractions;
  
  const aiCostTotal = deflectedInteractions * aiCost;
  const remainingHumanCostTotal = humanInteractions * humanCost;
  const newTotalCost = aiCostTotal + remainingHumanCostTotal;
  
  const savings = totalHumanCost - newTotalCost;
  const savingsPercent = (savings / totalHumanCost) * 100;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col h-full">
      <h3 className="text-xs font-bold uppercase tracking-widest text-textPrimary mb-6 flex items-center gap-2">
        <span className="text-primary">💰</span> ROI Simulator
      </h3>

      <div className="flex-1 flex flex-col gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-textMuted">Monthly Interactions</span>
              <span className="font-bold text-textPrimary">{interactions.toLocaleString()}</span>
            </div>
            <input type="range" min="100" max="50000" step="100" value={interactions} onChange={(e) => setInteractions(Number(e.target.value))} className="w-full accent-primary h-1 bg-border rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-textMuted">AI Deflection Rate</span>
              <span className="font-bold text-textPrimary">{deflectionRate}%</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={deflectionRate} onChange={(e) => setDeflectionRate(Number(e.target.value))} className="w-full accent-primary h-1 bg-border rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-textMuted">Cost without AI:</span>
            <span className="font-bold text-textPrimary line-through opacity-70">${totalHumanCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-textMuted">Cost with ChannelIQ:</span>
            <span className="font-bold text-success">${newTotalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          
          <div className="mt-2 p-3 bg-success/10 border border-success/20 rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-success uppercase font-bold tracking-widest">Est. Monthly Savings</span>
              <span className="text-2xl font-black text-success mt-0.5">${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success font-bold text-xs border border-success/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {Math.round(savingsPercent)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
