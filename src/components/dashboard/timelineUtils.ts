export const getTimelinePosition = (date: Date) => {
  const hours = date.getHours() + date.getMinutes() / 60;
  return (hours / 24) * 100;
};

export const getEventsInHour = (events: { time: Date; count: number }[], hour: number) => {
  return events.filter(event => event.time.getHours() === hour).length;
};

interface EventMetric {
  type: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  intensity: number;
  tags: string[];
  weeklyActivity: number[];
  timelineEvents: { time: Date; count: number }[];
}

export const calculateEventMetrics = (alerts: any[]): EventMetric[] => {
  const eventMetrics = alerts.reduce((acc: { [key: string]: EventMetric }, alert) => {
    const eventTypes = alert.tags.split(',').map((tag: string) => tag.trim());
    const title = alert.title;
    const alertDate = new Date(alert.system_time);
    
    if (!acc[title]) {
      acc[title] = {
        type: title,
        count: 0,
        firstSeen: new Date(alert.system_time),
        lastSeen: new Date(alert.system_time),
        intensity: 0,
        tags: [],
        weeklyActivity: Array(7).fill(0),
        timelineEvents: []
      };
    }
    
    const daysAgo = Math.floor((Date.now() - alertDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo >= 0 && daysAgo < 7) {
      acc[title].weeklyActivity[daysAgo]++;
    }
    
    acc[title].timelineEvents.push({
      time: alertDate,
      count: 1
    });
    
    acc[title].count++;
    acc[title].firstSeen = new Date(Math.min(acc[title].firstSeen.getTime(), alertDate.getTime()));
    acc[title].lastSeen = new Date(Math.max(acc[title].lastSeen.getTime(), alertDate.getTime()));
    
    eventTypes.forEach(tag => {
      if (!acc[title].tags.includes(tag)) {
        acc[title].tags.push(tag);
      }
    });
    
    return acc;
  }, {});

  return Object.values(eventMetrics)
    .sort((a, b) => b.count - a.count)
    .map((metric) => ({
      ...metric,
      intensity: (metric.count / Math.max(...Object.values(eventMetrics).map(m => m.count))) * 100,
      timelineEvents: metric.timelineEvents.sort((a, b) => 
        a.time.getTime() - b.time.getTime()
      )
    }));
};