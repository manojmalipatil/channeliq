import React from 'react';

const icons: Record<string, string> = {
  whatsapp: "💬",
  email: "✉️",
  webchat: "🌐",
  push: "🔔"
};

const badgeColors: Record<string, string> = {
  resolved: "bg-success/20 text-success border-success/30",
  escalated: "bg-warning/20 text-warning border-warning/30",
  dropped: "bg-danger/20 text-danger border-danger/30",
  converted: "bg-converted/20 text-converted border-converted/30"
};

export default function ChannelFeed({ feed }: { feed: Record<string, any[]> }) {
  const allMessages = Object.entries(feed).flatMap(([ch, msgs]) => 
    msgs.map(m => ({ ...m, _channel: ch }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20);

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <h3 className="text-xs font-bold text-textPrimary uppercase tracking-widest">Live Activity</h3>
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
          <span className="text-[10px] text-textMuted uppercase tracking-wider">{allMessages.length} Events</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 overflow-y-auto scrollbar-dark pr-2">
        {allMessages.length === 0 && (
          <div className="text-xs text-textMuted text-center py-8 bg-black/10 rounded-xl border border-white/5">No activity yet. Click Simulate.</div>
        )}
        {allMessages.map((msg, i) => {
          const initials = msg.customer_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
          const kpiColor = badgeColors[msg.kpi || 'escalated'];
          
          return (
            <div key={`${msg.id || i}-${msg.timestamp}`} className="group bg-card/40 p-3.5 rounded-xl border border-white/5 flex flex-col gap-2 transition-all hover:bg-card/80 hover:shadow-lg hover:border-white/10 animate-fade-in relative overflow-hidden cursor-pointer">
              <div className={`absolute top-0 left-0 w-1 h-full ${msg._channel === 'whatsapp' ? 'bg-[#25D366]' : msg._channel === 'email' ? 'bg-[#3b82f6]' : msg._channel === 'webchat' ? 'bg-[#06b6d4]' : 'bg-[#f97316]'} opacity-70 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="flex items-center justify-between pl-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-black/50 to-black/20 flex items-center justify-center text-[9px] font-bold text-textPrimary shadow-inner border border-white/5">
                    {initials}
                  </div>
                  <div className="text-xs font-bold text-textPrimary">{msg.customer_name}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] opacity-50 group-hover:opacity-100 transition-opacity" title={msg._channel}>{icons[msg._channel]}</span>
                  <div className="text-[9px] text-textMuted font-medium">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className="text-xs text-textMuted line-clamp-2 pl-2 mt-0.5 leading-relaxed">
                {msg.message_preview}
              </div>

              <div className="flex items-center justify-between mt-2 pl-2">
                <div className={`text-[9px] px-2 py-0.5 rounded border bg-black/20 uppercase tracking-wider font-bold ${kpiColor}`}>
                  {msg.kpi}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
