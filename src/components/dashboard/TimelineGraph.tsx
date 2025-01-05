import React, { useMemo, useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceArea,
} from 'recharts';
import { Alert } from './types';
import { processTimelineData, getSeverityColor, getCategoryColor } from './utils/timelineDataUtils';
import TimelineTooltip from './TimelineTooltip';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Filter } from 'lucide-react';

interface TimelineGraphProps {
  alerts: Alert[];
  onTimeRangeChange?: (start: Date, end: Date) => void;
}

const TimelineGraph = ({ alerts, onTimeRangeChange }: TimelineGraphProps) => {
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number } | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [brushActive, setBrushActive] = useState(false);

  const data = useMemo(() => processTimelineData(alerts), [alerts]);

  const handleZoomIn = () => {
    if (data.length > 1) {
      const midPoint = Math.floor(data.length / 2);
      const start = Math.max(0, midPoint - Math.floor(data.length / 4));
      const end = Math.min(data.length - 1, midPoint + Math.floor(data.length / 4));
      setZoomDomain({ start, end });
    }
  };

  const handleZoomOut = () => {
    setZoomDomain(null);
  };

  const handleBrushChange = useCallback((domain: any) => {
    if (domain && domain.startIndex !== undefined && domain.endIndex !== undefined) {
      const startDate = new Date(data[domain.startIndex].fullDate);
      const endDate = new Date(data[domain.endIndex].fullDate);
      onTimeRangeChange?.(startDate, endDate);
    }
  }, [data, onTimeRangeChange]);

  const severities = useMemo(() => 
    Array.from(new Set(alerts.map(alert => alert.rule_level))).filter(Boolean),
    [alerts]
  );

  return (
    <div className="w-full h-[400px] relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl" />
      
      <div className="relative w-full h-full p-4 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:border-blue-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="bg-blue-500/10 hover:bg-blue-500/20"
            >
              <ZoomIn className="h-4 w-4 mr-1" /> Zoom In
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="bg-blue-500/10 hover:bg-blue-500/20"
            >
              <ZoomOut className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-400" />
            <div className="flex gap-1">
              {severities.map((severity) => (
                <Badge
                  key={severity}
                  variant="outline"
                  className={`cursor-pointer transition-all ${
                    selectedSeverity === severity ? 'bg-blue-500/20' : ''
                  }`}
                  style={{
                    borderColor: getSeverityColor(severity),
                    color: getSeverityColor(severity),
                  }}
                  onClick={() => setSelectedSeverity(
                    selectedSeverity === severity ? null : severity
                  )}
                >
                  {severity}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(147, 197, 253, 0.1)"
              vertical={false}
            />
            
            <XAxis 
              dataKey="fullDate"
              stroke="#93c5fd"
              tick={{ 
                fill: '#93c5fd',
                fontSize: 12,
                fontFamily: 'monospace'
              }}
              height={50}
              angle={-45}
              textAnchor="end"
              interval={Math.floor(data.length / 8)}
              axisLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
              tickLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
              label={{
                value: "Timeline",
                position: "bottom",
                offset: 40,
                style: { fill: '#93c5fd' }
              }}
            />
            
            <YAxis 
              stroke="#93c5fd"
              tick={{ 
                fill: '#93c5fd',
                fontSize: 12,
                fontFamily: 'monospace'
              }}
              width={45}
              axisLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
              tickLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
              label={{
                value: "Event Count",
                angle: -90,
                position: "insideLeft",
                style: { fill: '#93c5fd' }
              }}
            />
            
            <Tooltip content={<TimelineTooltip />} />
            <Legend />
            
            <Area
              type="monotone"
              dataKey="count"
              name="Events"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorCount)"
              dot={(props: any) => {
                const severity = props.payload.severity;
                if (selectedSeverity && severity !== selectedSeverity) {
                  return null;
                }
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill={getSeverityColor(severity)}
                    stroke="#1a1f2c"
                    strokeWidth={2}
                    style={{ opacity: 0.8 }}
                  />
                );
              }}
              activeDot={{ 
                r: 6, 
                fill: '#60a5fa',
                stroke: '#93c5fd',
                strokeWidth: 2
              }}
            />

            <Brush
              dataKey="fullDate"
              height={30}
              stroke="#3b82f6"
              fill="#1a1f2c"
              onChange={handleBrushChange}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineGraph;