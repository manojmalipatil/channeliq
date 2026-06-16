import React from 'react';

export default function KPIDashboard({ stats }: { stats: any }) {
  if (!stats) return <div className="p-4 text-textMuted">Loading KPIs...</div>;

  const cards = [
    { label: "Resolved", icon: "✅", color: "border-l-success", count: stats.kpi_totals.resolved, rate: `${(stats.resolution_rate * 100).toFixed(1)}%` },
    { label: "Escalated", icon: "⚠️", color: "border-l-warning", count: stats.kpi_totals.escalated, rate: null },
    { label: "Dropped", icon: "💧", color: "border-l-danger", count: stats.kpi_totals.dropped, rate: `${((stats.kpi_totals.dropped / (stats.total_interactions || 1)) * 100).toFixed(1)}%` },
    { label: "Converted", icon: "💰", color: "border-l-converted", count: stats.kpi_totals.converted, rate: `${(stats.conversion_rate * 100).toFixed(1)}%` }
  ];

  const total = stats.total_interactions || 1;
  const channelColors: Record<string, string> = {
    whatsapp: "#25D366",
    email: "#3b82f6",
    webchat: "#06b6d4",
    push: "#f97316"
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
      {/* 4 Main KPI Cards */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map(c => {
          const colorMap: Record<string, string> = {
            Resolved: 'from-success/20 to-success/5 border-success/30 text-success',
            Escalated: 'from-warning/20 to-warning/5 border-warning/30 text-warning',
            Dropped: 'from-danger/20 to-danger/5 border-danger/30 text-danger',
            Converted: 'from-converted/20 to-converted/5 border-converted/30 text-converted'
          };
          const gradient = colorMap[c.label];

          return (
            <div key={c.label} className={`group relative overflow-hidden bg-gradient-to-br ${gradient} p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(var(--tw-colors-${c.label.toLowerCase()}),0.15)] bg-card/60 backdrop-blur-xl`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 text-5xl transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <div className="flex items-center gap-2 text-textMuted text-xs font-bold uppercase tracking-widest relative z-10">
                <span>{c.label}</span>
              </div>
              <div className="flex items-end justify-between mt-4 relative z-10">
                <div className="text-4xl font-black text-textPrimary tracking-tighter">{c.count}</div>
                {c.rate && <div className="text-xs font-bold px-2 py-1 rounded bg-black/30 backdrop-blur-md text-white/90 border border-white/10">{c.rate}</div>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Secondary Stats Section */}
      <div className="w-full xl:w-[450px] shrink-0 flex flex-col sm:flex-row xl:flex-col gap-4 lg:gap-6">
        
        <div className="flex-1 flex items-center justify-between px-6 bg-card/60 rounded-2xl border border-border backdrop-blur-xl py-4 shadow-lg">
          <div className="flex flex-col">
            <span className="text-[10px] text-textMuted uppercase font-bold tracking-widest mb-1">Total Events</span>
            <span className="text-2xl font-black text-textPrimary">{stats.total_interactions}</span>
          </div>
          <div className="w-px h-10 bg-border"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-textMuted uppercase font-bold tracking-widest mb-1">Channel Switches</span>
            <span className="text-2xl font-black text-secondary">{stats.channel_switches_today}</span>
          </div>
        </div>

        <div className="flex-1 bg-card/60 px-5 py-3 rounded-2xl border border-border backdrop-blur-xl shadow-lg flex flex-col justify-center">
          <div className="flex gap-2 h-3 w-full rounded-full overflow-hidden bg-black/40 border border-white/5">
            {Object.entries(stats.channel_breakdown).map(([ch, count]: [string, any]) => {
              const percentage = Math.max(1, (count / total) * 100);
              return (
                <div 
                  key={ch} 
                  className="h-full transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                  style={{ width: `${percentage}%`, backgroundColor: channelColors[ch] || '#3b82f6' }}
                  title={`${ch}: ${count}`}
                ></div>
              );
            })}
          </div>
          <div className="flex justify-between mt-3 px-1">
            {Object.entries(stats.channel_breakdown).map(([ch, count]: [string, any]) => (
              <div key={ch} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: channelColors[ch] || '#3b82f6' }}></div>
                <span className="text-[9px] text-textMuted uppercase font-bold tracking-widest">{ch}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
