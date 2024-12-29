import { Alert } from "./types";

export const getTimelinePosition = (time: Date): number => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  return ((hours * 60 + minutes) / (24 * 60)) * 100;
};

export const getEventsInHour = (events: { time: Date; count: number }[], hour: number): number => {
  return events.filter(event => event.time.getHours() === hour).length;
};

interface TimelineEvent {
  time: Date;
  count: number;
}

interface EventMetric {
  type: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  intensity: number;
  tags: string[];
  weeklyActivity: number[];
  timelineEvents: TimelineEvent[];
}

interface EventMetricsAccumulator {
  [key: string]: EventMetric;
}

export const calculateEventMetrics = (alerts: Alert[]): EventMetric[] => {
  const eventMetrics = alerts.reduce((acc: EventMetricsAccumulator, alert) => {
    const eventTypes = alert.tags.split(',').map(tag => tag.trim());
    const title = alert.title;
    const alertDate = new Date(alert.system_time);
    
    if (!acc[title]) {
      acc[title] = {
        type: title,
        count: 1,
        firstSeen: alertDate,
        lastSeen: alertDate,
        tags: eventTypes,
        weeklyActivity: Array(7).fill(0),
        timelineEvents: [{
          time: alertDate,
          count: 1
        }]
      };
    } else {
      acc[title].count += 1;
      acc[title].firstSeen = alertDate < acc[title].firstSeen ? alertDate : acc[title].firstSeen;
      acc[title].lastSeen = alertDate > acc[title].lastSeen ? alertDate : acc[title].lastSeen;
      
      // Update tags
      eventTypes.forEach(tag => {
        if (!acc[title].tags.includes(tag)) {
          acc[title].tags.push(tag);
        }
      });
      
      // Update timeline events
      acc[title].timelineEvents.push({
        time: alertDate,
        count: 1
      });
    }
    
    // Calculate day index (0-6) for weekly activity
    const dayIndex = 6 - Math.floor((Date.now() - alertDate.getTime()) / (1000 * 60 * 60 * 24));
    if (dayIndex >= 0 && dayIndex < 7) {
      acc[title].weeklyActivity[dayIndex] += 1;
    }
    
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(eventMetrics).map(m => m.count));

  return Object.values(eventMetrics)
    .sort((a, b) => b.count - a.count)
    .map(metric => ({
      ...metric,
      intensity: (metric.count / maxCount) * 100,
      timelineEvents: metric.timelineEvents.sort((a, b) => 
        a.time.getTime() - b.time.getTime()
      )
    }));
};