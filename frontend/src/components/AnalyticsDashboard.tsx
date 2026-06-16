import React from 'react';

const channelColors: Record<string, string> = {
  whatsapp: '#25D366',
  email: '#3b82f6',
  webchat: '#06b6d4',
  push: '#f97316'
};

export default function AnalyticsDashboard({ stats }: { stats: any }) {
  if (!stats) return <div className="p-8 text-center text-textMuted">Loading Analytics...</div>;

  const trendData = stats.trend_data || [];
  
  // 1. Donut Chart Calculations
  const channels = Object.entries(stats.channel_breakdown || {});
  const totalChannels = channels.reduce((acc, [_, count]: any) => acc + count, 0) || 1;
  
  const circleRadius = 35;
  const circleCircumference = 2 * Math.PI * circleRadius;
  let currentOffset = 0;

  // 2. Trend Line Chart Calculations
  const chartHeight = 150;
  const chartWidth = 600;
  
  const getCoordinates = (index: number, value: number, max: number) => {
    const x = (index / (trendData.length - 1 || 1)) * chartWidth;
    const y = chartHeight - (value / max) * chartHeight;
    return `${x},${y}`;
  };

  const sentimentPoints = trendData.map((d: any, i: number) => getCoordinates(i, d.sentiment, 100)).join(" L ");
  const conversionPoints = trendData.map((d: any, i: number) => getCoordinates(i, d.conversion, 50)).join(" L ");

  const sentimentPath = `M ${sentimentPoints}`;
  const conversionPath = `M ${conversionPoints}`;

  // 3. Bar Chart Calculations (AI vs Human)
  const resolved = stats.kpi_totals?.resolved || 0;
  const escalated = stats.kpi_totals?.escalated || 0;
  const totalRes = resolved + escalated || 1;

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto scrollbar-dark pb-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-card/40 backdrop-blur-xl border border-border p-6 rounded-2xl flex items-center justify-between shadow-xl shrink-0">
        <div>
          <h2 className="text-xl font-bold text-textPrimary">AI Marketing Analytics</h2>
          <p className="text-xs text-textMuted mt-1">Real-time insights on AI performance, sentiment, and ROI.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-textMuted font-bold">Est. Cost Saved</div>
            <div className="text-2xl font-black text-success">${(resolved * 4.50).toFixed(0)}</div>
          </div>
          <div className="w-px bg-border h-10 mx-2"></div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-textMuted font-bold">Customer Satisfaction</div>
            <div className="text-2xl font-black text-primary">94%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-xl flex flex-col group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-success opacity-50"></div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-textPrimary mb-6 flex justify-between relative z-10">
            <span>Sentiment & Conversion Trend (7 Days)</span>
            <div className="flex gap-3 text-[9px]">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> Sentiment</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(139,92,246,0.8)]"></div> Conversion Rate</span>
            </div>
          </h3>
          
          <div className="flex-1 w-full relative group-hover:scale-[1.01] transition-transform duration-500 min-h-[200px]">
            <svg viewBox={`0 -10 ${chartWidth} ${chartHeight + 30}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradientSentiment" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradientConversion" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.5, 1].map((ratio) => (
                <line key={ratio} x1="0" x2={chartWidth} y1={chartHeight * ratio} y2={chartHeight * ratio} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              ))}

              {/* Sentiment Path */}
              {trendData.length > 0 && (
                <>
                  <path d={`${sentimentPath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`} fill="url(#gradientSentiment)" className="animate-fade-in" />
                  <path d={sentimentPath} fill="none" stroke="#3b82f6" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  {trendData.map((d: any, i: number) => {
                    const [x, y] = getCoordinates(i, d.sentiment, 100).split(",");
                    return (
                      <g key={`s-${i}`}>
                        <circle cx={x} cy={y} r="4" fill="#09090b" stroke="#3b82f6" strokeWidth="2" />
                        <text x={x} y={Number(y) - 10} fill="#f8fafc" fontSize="10" textAnchor="middle" className="opacity-0 group-hover:opacity-100 transition-opacity">{d.sentiment}%</text>
                        <text x={x} y={chartHeight + 15} fill="#a1a1aa" fontSize="10" textAnchor="middle">{d.date}</text>
                      </g>
                    )
                  })}

                  {/* Conversion Path */}
                  <path d={`${conversionPath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`} fill="url(#gradientConversion)" className="animate-fade-in" style={{ animationDelay: '0.1s' }} />
                  <path d={conversionPath} fill="none" stroke="#8b5cf6" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                  {trendData.map((d: any, i: number) => {
                    const [x, y] = getCoordinates(i, d.conversion, 50).split(",");
                    return (
                      <g key={`c-${i}`}>
                        <circle cx={x} cy={y} r="4" fill="#09090b" stroke="#8b5cf6" strokeWidth="2" />
                        <text x={x} y={Number(y) - 10} fill="#f8fafc" fontSize="10" textAnchor="middle" className="opacity-0 group-hover:opacity-100 transition-opacity">{d.conversion}%</text>
                      </g>
                    )
                  })}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Vertical Stack for smaller charts */}
        <div className="flex flex-col gap-6">
          
          {/* Donut Chart: Channel ROI */}
          <div className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center relative flex-1 group">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-textPrimary absolute top-4 left-4 z-10">Channel Effectiveness</h3>
             <svg width="100%" height="120" viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:scale-105 transition-transform mt-4">
                <circle cx="50" cy="50" r={circleRadius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="15" />
                {channels.map(([ch, count]: any, idx) => {
                  const percentage = count / totalChannels;
                  const strokeDasharray = `${percentage * circleCircumference} ${circleCircumference}`;
                  const offset = currentOffset;
                  currentOffset += percentage * circleCircumference;
                  return (
                    <circle 
                      key={ch} cx="50" cy="50" r={circleRadius} fill="none" 
                      stroke={channelColors[ch] || '#3b82f6'} strokeWidth="15" 
                      strokeDasharray={strokeDasharray} strokeDashoffset={-offset}
                      className="transition-all duration-1000 ease-out"
                    />
                  );
                })}
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
                <span className="text-2xl font-black text-textPrimary">{totalChannels}</span>
                <span className="text-[8px] uppercase tracking-widest text-textMuted">Total Engagements</span>
             </div>
          </div>

          {/* Bar Chart: AI vs Human */}
          <div className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-xl flex flex-col relative flex-1 group">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-textPrimary mb-4">AI Resolution Accuracy</h3>
             
             <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                   <div className="w-16 text-[10px] font-bold text-textMuted text-right">AI Agent</div>
                   <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-success shadow-[0_0_10px_rgba(16,185,129,0.8)] rounded-full transition-all duration-1000" style={{ width: `${(resolved/totalRes)*100}%` }}></div>
                   </div>
                   <div className="w-8 text-[10px] font-bold text-success">{Math.round((resolved/totalRes)*100)}%</div>
                </div>

                <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform delay-75">
                   <div className="w-16 text-[10px] font-bold text-textMuted text-right">Human</div>
                   <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-warning shadow-[0_0_10px_rgba(245,158,11,0.8)] rounded-full transition-all duration-1000" style={{ width: `${(escalated/totalRes)*100}%` }}></div>
                   </div>
                   <div className="w-8 text-[10px] font-bold text-warning">{Math.round((escalated/totalRes)*100)}%</div>
                </div>
             </div>
             <p className="text-[9px] text-textMuted/70 mt-4 text-center">AI successfully deflected {resolved} tickets, saving approx ${(resolved*4.50).toFixed(0)} USD.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
