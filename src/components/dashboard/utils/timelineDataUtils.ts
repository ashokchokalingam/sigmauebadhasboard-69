import { Alert } from '../types';

export interface TimelineDataPoint {
  time: string;
  fullDate: string;
  count: number;
  severity: string;
  events: Alert[];
  categories: { [key: string]: number };
  anomalyCount: number;
}

export const processTimelineData = (alerts: Alert[]): TimelineDataPoint[] => {
  const timeData: { [key: string]: TimelineDataPoint } = {};
  
  alerts.forEach(alert => {
    const dateStr = alert.system_time || alert.first_time_seen;
    if (!dateStr) return;

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return;
      
      // Group by 5-minute intervals for better granularity
      const minutes = Math.floor(date.getMinutes() / 5) * 5;
      const hour = date.getHours();
      
      const formattedDate = date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const key = `${date.toISOString().split('T')[0]} ${hour}:${minutes}`;
      
      // Extract event categories from tags
      const categories = alert.tags.split(',').reduce((acc: { [key: string]: number }, tag) => {
        const category = tag.trim();
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Check if it's an anomaly
      const isAnomaly = typeof alert.dbscan_cluster === 'number' && alert.dbscan_cluster === -1;
      
      if (!timeData[key]) {
        timeData[key] = {
          time: `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
          fullDate: formattedDate,
          count: 1,
          severity: alert.rule_level || 'unknown',
          events: [alert],
          categories,
          anomalyCount: isAnomaly ? 1 : 0
        };
      } else {
        timeData[key].count++;
        timeData[key].events.push(alert);
        timeData[key].anomalyCount += isAnomaly ? 1 : 0;
        
        // Merge categories
        Object.entries(categories).forEach(([category, count]) => {
          timeData[key].categories[category] = (timeData[key].categories[category] || 0) + count;
        });
        
        // Update severity if higher priority
        if (alert.rule_level === 'critical' || alert.rule_level === 'high') {
          timeData[key].severity = alert.rule_level;
        }
      }
    } catch (error) {
      console.warn('Invalid date encountered:', dateStr);
      return;
    }
  });

  return Object.values(timeData).sort((a, b) => 
    new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
  );
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