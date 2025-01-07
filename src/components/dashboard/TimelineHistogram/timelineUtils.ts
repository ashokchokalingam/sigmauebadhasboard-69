export type TimeInterval = '5m' | '15m' | '1h' | '6h' | '1d';

export interface TimelineDataPoint {
  timestamp: string;
  count: number;
  severity?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export const processTimelineData = (data: any[]): TimelineDataPoint[] => {
  const timeMap = new Map<string, number>();
  
  data.forEach(event => {
    const timestamp = new Date(event.system_time || event.first_time_seen).toISOString();
    timeMap.set(timestamp, (timeMap.get(timestamp) || 0) + (event.total_events || 1));
  });

  return Array.from(timeMap.entries())
    .map(([timestamp, count]) => ({
      timestamp,
      count
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};