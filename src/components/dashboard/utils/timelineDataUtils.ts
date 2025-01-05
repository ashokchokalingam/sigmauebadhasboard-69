import { Alert } from '../types';

interface TimelineDataPoint {
  fullDate: string;
  counts: {
    [key: string]: number;
  };
  events: Alert[];
  categories: { [key: string]: number };
  anomalies: number;
  cumulativeTotal: number;
}

const getTimeKey = (date: Date, granularity: '5min' | 'hour' | 'day'): string => {
  switch (granularity) {
    case '5min':
      const minutes = Math.floor(date.getMinutes() / 5) * 5;
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${minutes}`;
    case 'hour':
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
    case 'day':
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    default:
      return '';
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
  let runningTotal = 0;
  
  alerts.forEach(alert => {
    try {
      const date = new Date(alert.system_time);
      if (isNaN(date.getTime())) return;
      
      const timeKey = getTimeKey(date, granularity);
      const formattedDate = getFormattedDate(date, granularity);
      
      // Extract event categories from tags
      const categories = alert.tags.split(',').reduce((acc: { [key: string]: number }, tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag) {
          acc[trimmedTag] = (acc[trimmedTag] || 0) + 1;
        }
        return acc;
      }, {});

      // Check for anomalies (you can customize this logic)
      const isAnomaly = alert.tags.toLowerCase().includes('anomaly');
      
      if (!timeData[timeKey]) {
        timeData[timeKey] = {
          fullDate: formattedDate,
          counts: {
            high: 0,
            medium: 0,
            low: 0,
            informational: 0
          },
          events: [],
          categories: {},
          anomalies: 0,
          cumulativeTotal: 0
        };
      }
      
      // Update counts based on severity
      const severity = alert.rule_level.toLowerCase();
      if (timeData[timeKey].counts.hasOwnProperty(severity)) {
        timeData[timeKey].counts[severity]++;
      }
      
      // Update categories
      Object.entries(categories).forEach(([category, count]) => {
        timeData[timeKey].categories[category] = (timeData[timeKey].categories[category] || 0) + count;
      });
      
      // Update anomalies count
      if (isAnomaly) {
        timeData[timeKey].anomalies++;
      }
      
      // Add event to the list
      timeData[timeKey].events.push(alert);
    } catch (error) {
      console.error('Error processing alert:', error);
    }
  });

  // Sort by time and calculate cumulative totals
  const sortedData = Object.values(timeData)
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
    .map(point => {
      const totalForPoint = Object.values(point.counts).reduce((sum, count) => sum + count, 0);
      runningTotal += totalForPoint;
      return {
        ...point,
        cumulativeTotal: runningTotal
      };
    });

  // If data is too sparse, default to hourly aggregation
  if (sortedData.length < 5 && granularity === '5min') {
    return processTimelineData(alerts, 'hour');
  }

  return sortedData;
};

export const getSeverityColor = (severity: string = ''): string => {
  switch (severity.toLowerCase()) {
    case 'high':
      return '#F97316'; // Orange
    case 'medium':
      return '#FBBF24'; // Yellow
    case 'low':
      return '#22C55E'; // Green
    case 'informational':
      return '#60A5FA'; // Blue
    default:
      return '#94A3B8'; // Gray
  }
};