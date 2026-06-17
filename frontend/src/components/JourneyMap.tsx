import React, { useRef, useEffect } from 'react';
import { JourneyEvent } from '@/types';

const channelIcons: Record<string, string> = {
  whatsapp: "💬",
  email: "✉️",
  webchat: "🌐",
  push: "🔔"
};

const borderColors: Record<string, string> = {
  resolved: "border-success text-success",
  escalated: "border-warning text-warning",
  dropped: "border-danger text-danger",
  converted: "border-converted text-converted"
};

export default function JourneyMap({ events, onSelectCustomer }: { events: JourneyEvent[], onSelectCustomer: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayEvents = [...events].slice(0, 20).reverse(); // oldest left, newest right

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [events]);

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl p-4 lg:p-6 relative">
      <div className="flex items-center justify-between mb-4 shrink-0 z-10 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="text-primary text-sm">🗺️</span>
          </div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-textPrimary">Customer Journey Map</h2>
        </div>
        <div className="bg-background px-3 py-1 rounded-full text-[10px] font-bold text-textMuted uppercase border border-border">
          {displayEvents.length} Nodes Active
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 flex items-center overflow-x-auto scrollbar-dark pb-4 px-2 relative z-10"
      >
        {displayEvents.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-textMuted">
            <div className="w-16 h-16 border border-dashed border-border rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl opacity-50">🧭</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider">Awaiting Network Traffic</span>
          </div>
        ) : (
          <div className="flex items-center min-w-max px-4 pb-2">
            {displayEvents.map((evt, idx) => {
              const prevEvt = idx > 0 ? displayEvents[idx - 1] : null;
              const isSameCustomer = prevEvt && prevEvt.customer_id === evt.customer_id;
              const isChannelSwitch = isSameCustomer && prevEvt.channel !== evt.channel;

              return (
                <React.Fragment key={`${evt.customer_id}-${idx}-${evt.timestamp}`}>
                  {idx > 0 && (
                    <div className="flex flex-col items-center mx-1 sm:mx-3 shrink-0 relative animate-fade-in">
                      {isChannelSwitch ? (
                        <>
                          <div className="h-0.5 w-10 sm:w-16 bg-primary opacity-50 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-white animate-slide-in-right"></div>
                          </div>
                          <span className="absolute -top-4 text-[9px] text-primary font-bold uppercase tracking-widest bg-background px-2 rounded-full border border-primary/30">Switch</span>
                        </>
                      ) : (
                        <div className={`h-px w-10 sm:w-16 ${isSameCustomer ? 'bg-border' : 'bg-border border-dashed'}`}></div>
                      )}
                    </div>
                  )}
                  
                  <div 
                    className="flex flex-col items-center gap-2.5 cursor-pointer group hover:-translate-y-1 transition-all duration-300 shrink-0 relative animate-slide-up"
                    onClick={() => onSelectCustomer(evt.customer_id)}
                  >
                    <div className="text-[10px] font-bold text-textPrimary uppercase tracking-wider bg-background px-2 py-0.5 rounded border border-border whitespace-nowrap max-w-[80px] truncate text-center" title={evt.customer_name}>
                      {evt.customer_name.split(' ')[0]}
                    </div>
                    
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border bg-background flex items-center justify-center ${borderColors[evt.kpi || 'escalated']} group-hover:border-primary transition-all duration-300 relative overflow-hidden`}>
                      <span className="text-xl sm:text-2xl z-10">{channelIcons[evt.channel]}</span>
                    </div>

                    <div className="text-[9px] font-bold uppercase tracking-widest text-textMuted group-hover:text-primary transition-colors">
                      {evt.channel}
                    </div>

                    <div className="absolute -bottom-8 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className={`text-[9px] px-2 py-0.5 rounded-full border bg-background uppercase font-bold tracking-wider ${borderColors[evt.kpi || 'escalated']}`}>
                        {evt.kpi}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
