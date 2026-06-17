import React from 'react';

const channelColors: Record<string, string> = {
  whatsapp: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20",
  email: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  webchat: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  push: "bg-orange-500/10 text-orange-500 border-orange-500/20"
};

const kpiColors: Record<string, string> = {
  resolved: "bg-success/10 text-success border-success/20",
  escalated: "bg-warning/10 text-warning border-warning/20",
  dropped: "bg-danger/10 text-danger border-danger/20",
  converted: "bg-converted/10 text-converted border-converted/20"
};

export default function CustomerPanel({ customer, onClose }: { customer: any, onClose?: () => void }) {
  if (!customer) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-card">
        <div className="text-textMuted text-center max-w-sm">
          <div className="text-4xl mb-4 opacity-50">👤</div>
          <p>Select a customer from the journey map to view their full cross-channel conversation</p>
        </div>
      </div>
    );
  }

  const initials = customer.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex-1 flex flex-col bg-card overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border bg-background flex items-start gap-4 shrink-0 relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-card text-textPrimary flex items-center justify-center text-xl font-black border border-border shadow-sm shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-black text-textPrimary tracking-tight truncate">{customer.name}</h2>
            {onClose && (
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-md hover:bg-border border border-transparent hover:border-border flex items-center justify-center text-textMuted hover:text-white transition-colors shrink-0"
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
      
      {/* Session KPI Summary */}
      <div className="px-4 lg:px-6 py-3 border-b border-border bg-background flex items-center justify-between shrink-0">
        <span className="text-[9px] text-textMuted uppercase font-bold tracking-widest">Session KPIs</span>
        <div className="flex gap-4 text-xs font-bold">
          <span className="text-success" title="Resolved">✅ {customer.session_kpis?.resolved || 0}</span>
          <span className="text-warning" title="Escalated">⚠️ {customer.session_kpis?.escalated || 0}</span>
          <span className="text-danger" title="Dropped">💧 {customer.session_kpis?.dropped || 0}</span>
          <span className="text-converted" title="Converted">💰 {customer.session_kpis?.converted || 0}</span>
        </div>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-dark flex flex-col gap-5 bg-card">
        {customer.unified_history.map((msg: any, idx: number) => {
          const isUser = msg.role === 'user';
          const prevMsg = idx > 0 ? customer.unified_history[idx - 1] : null;
          const isChannelSwitch = prevMsg && prevMsg.channel !== msg.channel;

          return (
            <React.Fragment key={msg.id || idx}>
              {isChannelSwitch && (
                <div className="flex items-center justify-center my-6 opacity-70">
                  <div className="h-px bg-border flex-1"></div>
                  <span className="px-4 py-1 text-[9px] font-bold text-textMuted uppercase tracking-widest bg-background rounded-full border border-border">
                    Switched to {msg.channel}
                  </span>
                  <div className="h-px bg-border flex-1"></div>
                </div>
              )}

              <div className={`flex flex-col max-w-[75%] lg:max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  {!isUser && msg.kpi && (
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${kpiColors[msg.kpi]}`}>
                      {msg.kpi}
                    </span>
                  )}
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${channelColors[msg.channel]}`}>
                    {msg.channel}
                  </span>
                  <span className="text-[10px] font-medium text-textMuted">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div 
                  className={`p-3.5 sm:p-4 text-sm leading-relaxed ${
                    isUser 
                      ? 'bg-primary text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-background border border-border text-textPrimary rounded-2xl rounded-tl-sm'
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
