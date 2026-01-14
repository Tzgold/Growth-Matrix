
export interface DataPoint {
  date: string;
  users: number;
  sessions: number;
}

export type TimeRange = '7d' | '30d' | 'all';
export type MetricType = 'users' | 'sessions';

export interface DashboardStats {
  totalValue: number;
  totalContrastValue: number;
  avgEngagement: number;
  growthRate: number;
}

export interface SummaryInsights {
  peakDay: string;
  peakValue: number;
  lowestDay: string;
  lowestValue: number;
  trend: 'increasing' | 'decreasing' | 'flat';
}
