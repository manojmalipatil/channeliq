export type Channel = 'whatsapp' | 'email' | 'webchat' | 'push';
export type KPILabel = 'resolved' | 'escalated' | 'dropped' | 'converted';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface UnifiedMessage {
  id: string;
  channel: Channel;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  kpi: KPILabel | null;
  sentiment?: Sentiment;
  image_data?: string;
}

export interface SessionKPIs {
  resolved: number;
  escalated: number;
  dropped: number;
  converted: number;
}

export interface CustomerContext {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  unified_history: UnifiedMessage[];
  active_channels: Channel[];
  last_channel: Channel;
  last_seen: string;
  session_kpis: SessionKPIs;
}

export interface DashboardStats {
  total_interactions: number;
  channel_breakdown: Record<Channel, number>;
  kpi_totals: SessionKPIs;
  resolution_rate: number;
  conversion_rate: number;
  avg_turns_to_resolve: number;
  channel_switches_today: number;
  journey_events: JourneyEvent[];
  trend_data: TrendDataPoint[];
}

export interface JourneyEvent {
  type: string;
  customer_id: string;
  customer_name: string;
  channel: Channel;
  kpi: KPILabel;
  sentiment?: Sentiment;
  message_preview: string;
  timestamp: string;
  role?: string;
}

export interface TrendDataPoint {
  date: string;
  sentiment: number;
  conversion: number;
}

export interface SSEEvent {
  type: string;
  customer_id: string;
  customer_name: string;
  channel: Channel;
  kpi: KPILabel;
  sentiment?: Sentiment;
  message_preview: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  channel: Channel;
  kpi?: KPILabel | null;
  sentiment?: Sentiment;
  image_data?: string;
  timestamp: string;
}

export const CHANNEL_CONFIG: Record<Channel, { label: string; color: string; icon: string }> = {
  whatsapp: { label: 'WhatsApp', color: '#25d366', icon: '💬' },
  email: { label: 'Email', color: '#3b82f6', icon: '✉️' },
  webchat: { label: 'WebChat', color: '#8b5cf6', icon: '🌐' },
  push: { label: 'Push', color: '#f97316', icon: '🔔' },
};

export const KPI_CONFIG: Record<KPILabel, { label: string; color: string; icon: string }> = {
  resolved: { label: 'Resolved', color: '#10b981', icon: '✓' },
  escalated: { label: 'Escalated', color: '#f59e0b', icon: '↑' },
  converted: { label: 'Converted', color: '#3b82f6', icon: '★' },
  dropped: { label: 'Dropped', color: '#f43f5e', icon: '✕' },
};
