"use client";

import React, { useEffect, useState, useRef } from 'react';
import KPIDashboard from '@/components/KPIDashboard';
import JourneyMap from '@/components/JourneyMap';
import ChannelFeed from '@/components/ChannelFeed';
import CustomerPanel from '@/components/CustomerPanel';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { triggerJourney, triggerBulk } from '@/components/SimulatorPanel';

export default function Page() {
  const [stats, setStats] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'analytics'>('live');
  const [journeyEvents, setJourneyEvents] = useState<any[]>([]);
  const [channelFeed, setChannelFeed] = useState<Record<string, any[]>>({
    whatsapp: [], email: [], webchat: [], push: []
  });
  const [toasts, setToasts] = useState<any[]>([]);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        if (journeyEvents.length === 0 && data.journey_events) {
          setJourneyEvents(data.journey_events);
          // Distribute events to channel feeds initially
          const newFeed: Record<string, any[]> = { whatsapp: [], email: [], webchat: [], push: [] };
          data.journey_events.forEach((evt: any) => {
            if (newFeed[evt.channel] && newFeed[evt.channel].length < 8) {
              newFeed[evt.channel].push(evt);
            }
          });
          setChannelFeed(newFeed);
        }
      }
    } catch (e) {
      console.error("Failed to fetch stats", e);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/customers`);
      if (res.ok) {
        setCustomers(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch customers", e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCustomers();
    const interval = setInterval(() => {
      fetchStats();
      fetchCustomers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const sse = new EventSource(`${API_URL}/events`);
    
    sse.onmessage = (e) => {
      const event = JSON.parse(e.data);
      
      setJourneyEvents(prev => [event, ...prev].slice(0, 50));
      
      setChannelFeed(prev => {
        const newFeed = { ...prev };
        newFeed[event.channel] = [event, ...(newFeed[event.channel] || [])].slice(0, 8);
        return newFeed;
      });

      const toastId = Date.now();
      setToasts(prev => [...prev, { id: toastId, ...event }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 4000);

      fetchStats();
      fetchCustomers();
    };

    return () => sse.close();
  }, [API_URL]);

  const [selectedCustomerContext, setSelectedCustomerContext] = useState<any>(null);

  useEffect(() => {
    if (selectedCustomerId) {
      fetch(`${API_URL}/context/${selectedCustomerId}`)
        .then(res => res.json())
        .then(data => setSelectedCustomerContext(data))
        .catch(e => console.error(e));
    } else {
      setSelectedCustomerContext(null);
    }
  }, [selectedCustomerId, API_URL, journeyEvents]); // re-fetch context if events arrive to get new messages

  const [isSimulating, setIsSimulating] = useState(false);
  const [isBulkTesting, setIsBulkTesting] = useState(false);

  const handleSimulateJourney = async () => {
    setIsSimulating(true);
    await triggerJourney();
    setToasts(prev => [...prev, { id: Date.now(), channel: 'whatsapp', message_preview: "Journey simulation started..." }]);
    setTimeout(() => setIsSimulating(false), 800);
  };

  const handleBulkTest = async () => {
    setIsBulkTesting(true);
    await triggerBulk();
    setToasts(prev => [...prev, { id: Date.now(), channel: 'email', message_preview: "Bulk test simulation started..." }]);
    setTimeout(() => setIsBulkTesting(false), 800);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background relative selection:bg-primary/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none z-0"></div>
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border glass-panel shrink-0 z-10">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white text-xl">⚡</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-textMuted">ChannelIQ</h1>
            <span className="text-[10px] text-textMuted hidden sm:block uppercase tracking-widest font-semibold mt-0.5">Omnichannel Orchestrator</span>
          </div>
        </div>

        {/* Center Tabs */}
        <div className="hidden md:flex items-center bg-black/40 p-1 rounded-xl border border-white/5 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('live')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'live' ? 'bg-card text-white shadow-md border border-white/10' : 'text-textMuted hover:text-white'}`}
          >
            Live Operations
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-card text-white shadow-md border border-white/10' : 'text-textMuted hover:text-white'}`}
          >
            Campaign Analytics
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-slow shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[10px] text-success font-bold tracking-widest uppercase">Live Sync</span>
          </div>
          
          <button 
            onClick={handleSimulateJourney} 
            disabled={isSimulating}
            className="px-4 py-2 bg-card hover:bg-cardHover border border-border text-textPrimary rounded-lg text-xs font-semibold transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isSimulating ? <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <span>🚀</span>}
            <span>{isSimulating ? "Simulating..." : "Simulate Journey"}</span>
          </button>
          
          <button 
            onClick={handleBulkTest} 
            disabled={isBulkTesting}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-lg text-xs font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 disabled:opacity-50 disabled:pointer-events-none hidden lg:flex items-center gap-2"
          >
            {isBulkTesting ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>⚡</span>}
            <span>{isBulkTesting ? "Running..." : "Bulk Test"}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 p-4 lg:p-6 gap-6">
        
        {/* Top Row: KPIs (Always visible) */}
        <div className="w-full shrink-0">
          <KPIDashboard stats={stats} />
        </div>

        {/* Bottom Area: Conditional Rendering based on Tab */}
        {activeTab === 'live' ? (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden relative animate-fade-in">
            {/* Left Column: Feed */}
            <div className="w-full lg:w-[350px] xl:w-[400px] flex flex-col bg-card/50 backdrop-blur-xl rounded-2xl border border-border overflow-hidden shadow-2xl shrink-0">
              <ChannelFeed feed={channelFeed} />
            </div>

            {/* Right Column: Map */}
            <div className="flex-1 flex flex-col bg-card/50 backdrop-blur-xl rounded-2xl border border-border overflow-hidden shadow-2xl relative">
              <JourneyMap events={journeyEvents} onSelectCustomer={setSelectedCustomerId} />
            </div>

            {/* Slide-Over Overlay: Customer Panel */}
            {selectedCustomerId && (
              <>
                <div 
                  className="absolute inset-0 bg-background/20 backdrop-blur-sm z-40 rounded-2xl animate-fade-in transition-opacity cursor-pointer" 
                  onClick={() => setSelectedCustomerId(null)}
                ></div>
                <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] md:w-[500px] bg-card/95 backdrop-blur-3xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-50 animate-slide-in-right rounded-r-2xl sm:rounded-none lg:rounded-r-2xl overflow-hidden flex flex-col">
                  <CustomerPanel customer={selectedCustomerContext} onClose={() => setSelectedCustomerId(null)} />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-hidden relative">
            <AnalyticsDashboard stats={stats} />
          </div>
        )}

      </div>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50 pointer-events-none">
        {toasts.map(t => {
          const borderColors: Record<string, string> = {
            whatsapp: "border-[#25D366]",
            email: "border-[#3b82f6]",
            webchat: "border-[#06b6d4]",
            push: "border-[#f97316]"
          };
          return (
            <div key={t.id} className={`glass-panel p-4 rounded-xl border-l-4 ${borderColors[t.channel] || 'border-primary'} animate-fade-in shadow-2xl pointer-events-auto max-w-sm flex flex-col gap-2`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${borderColors[t.channel]?.replace('border-', 'bg-')}`}></div>
                  <span className="font-bold capitalize text-[10px] text-textMuted tracking-wider">{t.channel}</span>
                </div>
                {t.kpi && <span className="text-[9px] px-2 py-0.5 bg-background/50 rounded-full font-medium border border-border/50 uppercase">{t.kpi}</span>}
              </div>
              <p className="text-sm text-textPrimary leading-relaxed line-clamp-2">{t.message_preview}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
