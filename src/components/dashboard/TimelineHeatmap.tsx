import { useCallback, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { format } from 'date-fns';
import { Alert } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity } from 'lucide-react';

interface TimelineHeatmapProps {
  alerts: Alert[];
}

interface TimePoint {
  timestamp: string;
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
  total: number;
  rawDate: Date;
}

const TimelineHeatmap = ({ alerts }: TimelineHeatmapProps) => {
  const processData = useCallback((alerts: Alert[]): TimePoint[] => {
    console.log('Processing alerts for heatmap:', alerts.length);
    const timePoints: { [key: string]: TimePoint } = {};
    
    alerts.forEach(alert => {
      const date = new Date(alert.system_time);
      const hour = date.getHours();
      const timeKey = `${format(date, 'MMM dd')} ${hour}:00`;
      
      if (!timePoints[timeKey]) {
        timePoints[timeKey] = {
          timestamp: timeKey,
          Critical: 0,
          High: 0,
          Medium: 0,
          Low: 0,
          total: 0,
          rawDate: date
        };
      }
      
      // Default to Low if rule_level is undefined
      const severity = alert.rule_level || 'Low';
      if (severity in timePoints[timeKey]) {
        timePoints[timeKey][severity as keyof Omit<TimePoint, 'timestamp' | 'total' | 'rawDate'>]++;
        timePoints[timeKey].total++;
      }
    });

    // Sort by timestamp and ensure we have at least some data points
    const sortedData = Object.values(timePoints).sort((a, b) => 
      a.rawDate.getTime() - b.rawDate.getTime()
    );

    // If no data points exist, create some empty ones for visual consistency
    if (sortedData.length === 0) {
      const now = new Date();
      for (let i = 0; i < 24; i++) {
        const hour = now.getHours() - i;
        const date = new Date(now);
        date.setHours(hour);
        
        sortedData.unshift({
          timestamp: `${format(date, 'MMM dd')} ${hour}:00`,
          Critical: 0,
          High: 0,
          Medium: 0,
          Low: 0,
          total: 0,
          rawDate: date
        });
      }
    }

    console.log('Processed timeline data:', sortedData);
    return sortedData;
  }, []);

  const data = useMemo(() => processData(alerts), [alerts, processData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalEvents = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      const date = new Date(payload[0]?.payload.rawDate);
      
      return (
        <div className="bg-[#1a1f2c] border border-blue-500/20 rounded-lg p-4 shadow-xl min-w-[200px]">
          <p className="text-blue-100 font-medium mb-2">
            {format(date, 'MMM dd, HH:mm')}
          </p>
          
          {payload.map((entry: any) => (
            entry.value > 0 && (
              <div key={entry.name} className="flex items-center justify-between gap-4 py-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-blue-200">{entry.name}</span>
                </div>
                <span className="text-blue-100 font-mono">
                  {entry.value}
                </span>
              </div>
            )
          ))}
          
          {totalEvents > 0 && (
            <div className="mt-2 pt-2 border-t border-blue-500/20">
              <div className="flex justify-between">
                <span className="text-blue-200">Total:</span>
                <span className="text-blue-100 font-mono">
                  {totalEvents} {totalEvents === 1 ? 'event' : 'events'}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-black/40 border-blue-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-100">
          <Activity className="h-5 w-5 text-blue-500" />
          Event Distribution by Severity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barSize={20}
            >
              <defs>
                <linearGradient id="criticalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.4}/>
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="rgba(255,255,255,0.05)"
              />
              
              <XAxis
                dataKey="timestamp"
                stroke="#475569"
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickMargin={10}
              />
              
              <YAxis
                stroke="#475569"
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />

              <Bar
                dataKey="Critical"
                stackId="a"
                fill="url(#criticalGradient)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="High"
                stackId="a"
                fill="url(#highGradient)"
              />
              <Bar
                dataKey="Medium"
                stackId="a"
                fill="url(#mediumGradient)"
              />
              <Bar
                dataKey="Low"
                stackId="a"
                fill="url(#lowGradient)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="text-sm text-blue-300/70">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500/80" />
            <span className="text-sm text-blue-300/70">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500/80" />
            <span className="text-sm text-blue-300/70">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-sm text-blue-300/70">Low</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineHeatmap;