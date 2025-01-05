import { Alert } from '../types';

export interface TimelineDataPoint {
  time: string;
  fullDate: string;
  count: number;
  severity: string;
  events: Alert[];
}

export const processTimelineData = (alerts: Alert[]): TimelineDataPoint[] => {
  const timeData: { [key: string]: TimelineDataPoint } = {};
  
  alerts.forEach(alert => {
    const dateStr = alert.system_time || alert.first_time_seen;
    if (!dateStr) return;

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return;
      
      const minutes = Math.floor(date.getMinutes() / 15) * 15;
      const hour = date.getHours();
      
      const formattedDate = date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const key = `${date.toISOString().split('T')[0]} ${hour}:${minutes}`;
      
      if (!timeData[key]) {
        timeData[key] = {
          time: `${hour}:${minutes}`,
          fullDate: formattedDate,
          count: 1,
          severity: alert.rule_level || 'unknown',
          events: [alert]
        };
      } else {
        timeData[key].count++;
        timeData[key].events.push(alert);
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
  if (s.includes('critical')) return '#FF4500';
  if (s.includes('high')) return '#FF8C00';
  if (s.includes('medium')) return '#FFD700';
  if (s.includes('low')) return '#32CD32';
  if (s.includes('informational')) return '#1E90FF';
  return '#3b82f6';
};