import { Alert } from '../types';

export interface TimelineDataPoint {
  time: string;
  fullDate: string;
  counts: {
    [key: string]: number;
  };
  events: Alert[];
  categories: { [key: string]: number };
  anomalies: number;
}

const getTimeKey = (date: Date, granularity: '5min' | 'hour' | 'day'): string => {
  switch (granularity) {
    case '5min':
      const minutes = Math.floor(date.getMinutes() / 5) * 5;
      return `${date.getHours().toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    case 'hour':
      return `${date.getHours().toString().padStart(2, '0')}:00`;
    case 'day':
      return date.toISOString().split('T')[0];
    default:
      return date.toISOString();
  }
};

const getFormattedDate = (date: Date, granularity: '5min' | 'hour' | 'day'): string => {
  switch (granularity) {
    case '5min':
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    case 'hour':
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        hour12: true
      });
    case 'day':
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric'
      });
  }
};

export const processTimelineData = (
  alerts: Alert[],
  granularity: '5min' | 'hour' | 'day' = 'hour'
): TimelineDataPoint[] => {
  const timeData: { [key: string]: TimelineDataPoint } = {};
  
  alerts.forEach(alert => {
    const dateStr = alert.system_time || alert.first_time_seen;
    if (!dateStr) return;

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return;
      
      const timeKey = getTimeKey(date, granularity);
      const formattedDate = getFormattedDate(date, granularity);
      
      // Extract event categories from tags
      const categories = alert.tags.split(',').reduce((acc: { [key: string]: number }, tag) => {
        const category = tag.trim();
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Check if it's an anomaly
      const isAnomaly = typeof alert.dbscan_cluster === 'number' && alert.dbscan_cluster === -1;
      
      if (!timeData[timeKey]) {
        timeData[timeKey] = {
          time: timeKey,
          fullDate: formattedDate,
          counts: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            informational: 0
          },
          events: [alert],
          categories,
          anomalies: isAnomaly ? 1 : 0
        };
      } else {
        timeData[timeKey].events.push(alert);
        timeData[timeKey].anomalies += isAnomaly ? 1 : 0;
        
        // Merge categories
        Object.entries(categories).forEach(([category, count]) => {
          timeData[timeKey].categories[category] = (timeData[timeKey].categories[category] || 0) + count;
        });
      }
      
      // Increment the count for the appropriate severity level
      const severity = alert.rule_level?.toLowerCase() || 'informational';
      timeData[timeKey].counts[severity] = (timeData[timeKey].counts[severity] || 0) + 1;
      
    } catch (error) {
      console.warn('Invalid date encountered:', dateStr);
      return;
    }
  });

  // Sort by time and ensure we have at least one data point per interval
  const sortedData = Object.values(timeData).sort((a, b) => 
    new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
  );

  // If data is too sparse, default to hourly aggregation
  if (sortedData.length < 5 && granularity === '5min') {
    return processTimelineData(alerts, 'hour');
  }

  return sortedData;
};

export const getSeverityColor = (severity: string = ''): string => {
  const s = severity.toLowerCase();
  if (s.includes('critical')) return '#ef4444';
  if (s.includes('high')) return '#f97316';
  if (s.includes('medium')) return '#eab308';
  if (s.includes('low')) return '#22c55e';
  if (s.includes('informational')) return '#3b82f6';
  return '#3b82f6';
};

export const getCategoryColor = (category: string): string => {
  // Hash the category string to generate a consistent color
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to HSL color with fixed saturation and lightness
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};