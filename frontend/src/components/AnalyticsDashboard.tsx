import React, { useState } from 'react';
import ROICalculator from './ROICalculator';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import ReactMarkdown from 'react-markdown';

const channelColors: Record<string, string> = {
  whatsapp: '#25D366',
  email: '#3b82f6',
  webchat: '#06b6d4',
  push: '#f97316'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-xl">
        <p className="text-textPrimary text-xs font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-textMuted">{entry.name}:</span>
            <span className="text-textPrimary font-bold">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsDashboard({ stats }: { stats: any }) {
  const [reportData, setReportData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!stats) return <div className="p-8 text-center text-textMuted">Loading Analytics...</div>;

  const trendData = stats.trend_data || [];
  const channels = Object.entries(stats.channel_breakdown || {}).map(([name, value]) => ({ name, value }));
  const resolved = stats.kpi_totals?.resolved || 0;
  const escalated = stats.kpi_totals?.escalated || 0;
  const aiData = [
    { name: 'AI vs Human', AI: resolved, Human: escalated }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:8000/dashboard/report');
      const data = await res.json();
      setReportData(data.report);
    } catch (e) {
      setReportData("Failed to generate report. Make sure the backend is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto scrollbar-dark pb-6 animate-fade-in relative">
      
      {/* Top Banner */}
      <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-xl shrink-0">
        <div>
          <h2 className="text-xl font-bold text-textPrimary">AI Marketing Analytics</h2>
          <p className="text-xs text-textMuted mt-1">Real-time insights on AI performance, sentiment, and ROI.</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
          >
            {isGenerating ? <span className="animate-spin text-lg">↻</span> : <span>📄 Generate AI Report</span>}
          </button>
          <div className="w-px bg-border h-10"></div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-textMuted font-bold">Est. Cost Saved</div>
            <div className="text-2xl font-black text-success">${(resolved * 4.50).toFixed(0)}</div>
          </div>
          <div className="w-px bg-border h-10"></div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-textMuted font-bold">Customer Satisfaction</div>
            <div className="text-2xl font-black text-primary">{(stats.resolution_rate * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        
        {/* Trend Area Chart (Recharts) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col relative overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-widest text-textPrimary mb-6">
            Sentiment & Conversion Trend (7 Days)
          </h3>
          
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="sentiment" name="Sentiment" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorSentiment)" />
                <Area type="monotone" dataKey="conversion" name="Conversion Rate" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorConversion)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vertical Stack */}
        <div className="flex flex-col gap-6 h-full">
          {/* ROI Calculator */}
          <div className="flex-1">
             <ROICalculator />
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px]">
        {/* Donut Chart: Channel Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest text-textPrimary mb-4">Channel Distribution</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channels}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={channelColors[entry.name as string] || '#f59e0b'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} itemStyle={{ color: 'var(--text-primary)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} formatter={(value) => <span className="capitalize">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: AI vs Human */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest text-textPrimary mb-4">AI vs Human Resolution</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={aiData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} width={80} />
                <Tooltip cursor={{ fill: 'var(--border)', opacity: 0.4 }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="AI" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Human" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setReportData(null)}></div>
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-3xl max-h-full overflow-y-auto shadow-2xl animate-slide-up p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">📄</div>
                <div>
                  <h2 className="text-xl font-bold text-textPrimary">Executive Summary</h2>
                  <p className="text-xs text-textMuted uppercase tracking-widest mt-1">Generated by Gemini AI</p>
                </div>
              </div>
              <button onClick={() => setReportData(null)} className="text-textMuted hover:text-textPrimary transition-colors w-8 h-8 flex items-center justify-center bg-background rounded-md border border-border">✕</button>
            </div>
            
            <div className="prose prose-invert max-w-none text-textPrimary prose-headings:text-textPrimary prose-a:text-primary">
              <ReactMarkdown>{reportData}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
