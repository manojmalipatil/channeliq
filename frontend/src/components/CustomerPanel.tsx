import React from 'react';

const channelColors: Record<string, string> = {
  whatsapp: "bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30",
  email: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  webchat: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  push: "bg-orange-500/20 text-orange-400 border-orange-500/30"
};

const kpiColors: Record<string, string> = {
  resolved: "bg-success/20 text-success border-success/30",
  escalated: "bg-warning/20 text-warning border-warning/30",
  dropped: "bg-danger/20 text-danger border-danger/30",
  converted: "bg-converted/20 text-converted border-converted/30"
};

export default function CustomerPanel({ customer, onClose }: { customer: any, onClose?: () => void }) {
  if (!customer) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-transparent">
        <div className="text-textMuted text-center max-w-sm">
          <div className="text-4xl mb-4 opacity-50">👤</div>
          <p>Select a customer from the journey map to view their full cross-channel conversation</p>
        </div>
      </div>
    );
  }

  const initials = customer.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex-1 flex flex-col bg-transparent overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border bg-card/40 backdrop-blur-md flex items-start gap-4 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-card to-border text-textPrimary flex items-center justify-center text-xl font-black border border-white/10 shadow-lg relative z-10 shrink-0">
          {initials}
        </div>
        <div className="flex-1 relative z-10 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-black text-textPrimary tracking-tight truncate">{customer.name}</h2>
            {onClose && (
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 border border-white/5 flex items-center justify-center text-textMuted hover:text-white transition-colors shrink-0"
              >
                ✕
              </button>
            )}
          </div>
          <div className="text-[11px] font-medium text-textMuted mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5"><span className="opacity-70">✉️</span> <span className="truncate">{customer.email}</span></span>
            <span className="flex items-center gap-1.5"><span className="opacity-70">📞</span> {customer.phone}</span>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {customer.active_channels.map((ch: string) => (
              <span key={ch} className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border ${channelColors[ch] || 'bg-border text-textMuted'}`}>
                {ch}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Session KPI Summary mini-bar (moved below header for better space) */}
      <div className="px-4 lg:px-6 py-3 border-b border-border bg-black/10 flex items-center justify-between shrink-0">
        <span className="text-[9px] text-textMuted uppercase font-bold tracking-widest">Session KPIs</span>
        <div className="flex gap-4 text-xs font-bold">
          <span className="text-success drop-shadow-md" title="Resolved">✅ {customer.session_kpis.resolved}</span>
          <span className="text-warning drop-shadow-md" title="Escalated">⚠️ {customer.session_kpis.escalated}</span>
          <span className="text-danger drop-shadow-md" title="Dropped">💧 {customer.session_kpis.dropped}</span>
          <span className="text-converted drop-shadow-md" title="Converted">💰 {customer.session_kpis.converted}</span>
        </div>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-dark flex flex-col gap-5 relative z-10">
        {customer.unified_history.map((msg: any, idx: number) => {
          const isUser = msg.role === 'user';
          const prevMsg = idx > 0 ? customer.unified_history[idx - 1] : null;
          const isChannelSwitch = prevMsg && prevMsg.channel !== msg.channel;

          return (
            <React.Fragment key={msg.id || idx}>
              {isChannelSwitch && (
                <div className="flex items-center justify-center my-6 opacity-70 animate-fade-in">
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-border flex-1"></div>
                  <span className="px-4 py-1 text-[9px] font-bold text-textMuted uppercase tracking-widest bg-background/50 rounded-full border border-border backdrop-blur-sm shadow-sm">
                    Switched to {msg.channel}
                  </span>
                  <div className="h-px bg-gradient-to-r from-border via-border to-transparent flex-1"></div>
                </div>
              )}

              <div className={`flex flex-col max-w-[75%] lg:max-w-[65%] animate-slide-up ${isUser ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  {!isUser && msg.kpi && (
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${kpiColors[msg.kpi]} shadow-sm`}>
                      {msg.kpi}
                    </span>
                  )}
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${channelColors[msg.channel]}`}>
                    {msg.channel}
                  </span>
                  <span className="text-[10px] font-medium text-textMuted/60">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div 
                  className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
                    isUser 
                      ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-tr-sm border border-primary/50' 
                      : 'bg-card/60 border border-border/80 text-textPrimary rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
