import { Alert } from '../types';

export type TimeInterval = '5m' | '15m' | '1h' | '6h' | '1d';

export interface TimelineDataPoint {
  timestamp: string;
  count: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const getIntervalMilliseconds = (interval: TimeInterval): number => {
  switch (interval) {
    case '5m': return 5 * 60 * 1000;
    case '15m': return 15 * 60 * 1000;
    case '1h': return 60 * 60 * 1000;
    case '6h': return 6 * 60 * 60 * 1000;
    case '1d': return 24 * 60 * 60 * 1000;
  }
};

export const processTimelineData = (alerts: Alert[], interval: TimeInterval): TimelineDataPoint[] => {
  if (!alerts || alerts.length === 0) return [];

  const intervalMs = getIntervalMilliseconds(interval);
  const timePoints: { [key: string]: TimelineDataPoint } = {};

  // Find the time range
  const timestamps = alerts.map(alert => new Date(alert.system_time).getTime());
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  // Create time buckets
  for (let time = minTime; time <= maxTime; time += intervalMs) {
    timePoints[time] = {
      timestamp: new Date(time).toISOString(),
      count: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
  }

  // Fill the buckets with data
  alerts.forEach(alert => {
    const time = new Date(alert.system_time).getTime();
    const bucketTime = Math.floor(time / intervalMs) * intervalMs;
    
    if (timePoints[bucketTime]) {
      timePoints[bucketTime].count++;
      
      switch (alert.rule_level?.toLowerCase()) {
        case 'critical':
          timePoints[bucketTime].critical++;
          break;
        case 'high':
          timePoints[bucketTime].high++;
          break;
        case 'medium':
          timePoints[bucketTime].medium++;
          break;
        case 'low':
          timePoints[bucketTime].low++;
          break;
      }
    }
  });

  return Object.values(timePoints);
};