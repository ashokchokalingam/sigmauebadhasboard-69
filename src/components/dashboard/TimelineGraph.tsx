import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert } from "./types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Clock, ZoomIn, ZoomOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineGraphProps {
  alerts: Alert[];
  onTimeRangeChange?: (range: { start: Date; end: Date }) => void;
}

const TimelineGraph = ({ alerts }: TimelineGraphProps) => {
  const [selectedRange, setSelectedRange] = useState<'1h' | '24h' | '7d'>('24h');
  
  const data = useMemo(() => {
    if (!alerts?.length) return [];
    
    // Group alerts by hour
    const timeGroups = alerts.reduce((acc: { [key: string]: any }, alert) => {
      const date = new Date(alert.system_time);
      const hour = date.toISOString().slice(0, 13); // Group by hour
      
      if (!acc[hour]) {
        acc[hour] = {
          time: hour,
          total: 0,
          high: 0,
          medium: 0,
          low: 0
        };
      }
      
      acc[hour].total++;
      const severity = alert.rule_level?.toLowerCase() || 'low';
      acc[hour][severity]++;
      
      return acc;
    }, {});
    
    return Object.values(timeGroups).sort((a, b) => a.time.localeCompare(b.time));
  }, [alerts]);

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!alerts || alerts.length === 0) {
    return (
      <Card className="p-8 bg-black/40 border-blue-500/10">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Clock className="w-12 h-12 text-blue-500/50" />
          <h3 className="text-lg font-medium text-blue-100">No Timeline Data</h3>
          <p className="text-sm text-blue-300/70">
            There are no events to display in the timeline yet
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/40 border-blue-500/10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-blue-100">Event Timeline</h3>
            <p className="text-sm text-blue-300/70">
              Distribution of events over time
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {['1h', '24h', '7d'].map((range) => (
              <Badge
                key={range}
                variant={selectedRange === range ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedRange === range 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'hover:bg-blue-500/10'
                }`}
                onClick={() => setSelectedRange(range as any)}
              >
                {range}
              </Badge>
            ))}
            
            <div className="ml-2 flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-blue-500/10 hover:bg-blue-500/10"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-blue-500/10 hover:bg-blue-500/10"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              barGap={0}
              barCategoryGap="10%"
            >
              <defs>
                <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="rgba(255,255,255,0.05)" 
              />
              
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis}
                stroke="#475569"
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickLine={false}
              />
              
              <YAxis 
                stroke="#475569"
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickLine={false}
                width={40}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                itemStyle={{ color: '#94A3B8' }}
                labelStyle={{ color: '#E2E8F0', marginBottom: '8px' }}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleString();
                }}
              />

              <Bar 
                dataKey="high" 
                stackId="stack"
                fill="url(#highGradient)"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="medium" 
                stackId="stack"
                fill="url(#mediumGradient)"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="low" 
                stackId="stack"
                fill="url(#lowGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/80" />
            <span className="text-sm text-blue-300/70">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500/80" />
            <span className="text-sm text-blue-300/70">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500/80" />
            <span className="text-sm text-blue-300/70">Low</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimelineGraph;