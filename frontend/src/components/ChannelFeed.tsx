import React, { useState } from 'react';
import { SSEEvent } from '@/types';

const icons: Record<string, string> = {
  whatsapp: "💬",
  email: "✉️",
  webchat: "🌐",
  push: "🔔"
};

const badgeColors: Record<string, string> = {
  resolved: "bg-success/10 text-success border-success/20",
  escalated: "bg-warning/10 text-warning border-warning/20",
  dropped: "bg-danger/10 text-danger border-danger/20",
  converted: "bg-converted/10 text-converted border-converted/20"
};

export default function ChannelFeed({ feed }: { feed: Record<string, SSEEvent[]> }) {
  const [filter, setFilter] = useState<string>('all');
  
  const allMessages = Object.entries(feed).flatMap(([ch, msgs]) => 
    msgs.map(m => ({ ...m, _channel: ch }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 30);

  const displayedMessages = filter === 'all' 
    ? allMessages 
    : allMessages.filter(m => m._channel === filter);

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-4 h-full bg-card rounded-2xl">
      <div className="flex flex-col gap-4 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-textPrimary uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-dot"></div> Live Feed
          </h3>
          <div className="text-[10px] text-textMuted uppercase tracking-wider font-bold">
            {allMessages.length} Events
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-dark pb-1">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-primary border-primary text-white' : 'bg-background border-border text-textMuted hover:border-primary/50'}`}>All</button>
          <button onClick={() => setFilter('whatsapp')} className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${filter === 'whatsapp' ? 'bg-whatsapp border-whatsapp text-white' : 'bg-background border-border text-textMuted hover:border-whatsapp/50'}`}>WhatsApp</button>
          <button onClick={() => setFilter('email')} className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${filter === 'email' ? 'bg-email border-email text-white' : 'bg-background border-border text-textMuted hover:border-email/50'}`}>Email</button>
          <button onClick={() => setFilter('webchat')} className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${filter === 'webchat' ? 'bg-webchat border-webchat text-white' : 'bg-background border-border text-textMuted hover:border-webchat/50'}`}>WebChat</button>
          <button onClick={() => setFilter('push')} className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${filter === 'push' ? 'bg-push border-push text-white' : 'bg-background border-border text-textMuted hover:border-push/50'}`}>Push</button>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 overflow-y-auto scrollbar-dark pr-2 h-full">
        {displayedMessages.length === 0 && (
          <div className="text-xs text-textMuted text-center py-8 bg-background rounded-xl border border-border">No activity yet. Click Simulate.</div>
        )}
        {displayedMessages.map((msg, i) => {
          const initials = msg.customer_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
          const kpiColor = badgeColors[msg.kpi || 'escalated'];
          
          return (
            <div key={`${msg.customer_id || i}-${msg.timestamp}`} className="group bg-background p-3.5 rounded-xl border border-border flex flex-col gap-2 transition-all hover:border-primary/50 animate-slide-up relative overflow-hidden cursor-pointer">
              <div className={`absolute top-0 left-0 w-1 h-full ${msg._channel === 'whatsapp' ? 'bg-whatsapp' : msg._channel === 'email' ? 'bg-email' : msg._channel === 'webchat' ? 'bg-webchat' : 'bg-push'} opacity-100`}></div>
              
              <div className="flex items-center justify-between pl-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center text-[9px] font-bold text-textPrimary border border-border">
                    {initials}
                  </div>
                  <div className="text-xs font-bold text-textPrimary">{msg.customer_name}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity" title={msg._channel}>{icons[msg._channel]}</span>
                  <div className="text-[9px] text-textMuted font-medium">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className="text-xs text-textMuted line-clamp-2 pl-2 mt-0.5 leading-relaxed">
                {msg.message_preview}
              </div>

              <div className="flex items-center justify-between mt-2 pl-2">
                <div className={`text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${kpiColor}`}>
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
