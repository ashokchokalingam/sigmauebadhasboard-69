import React, { useMemo, useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  Legend,
} from 'recharts';
import { Alert } from './types';
import { processTimelineData, getSeverityColor } from './utils/timelineDataUtils';
import TimelineTooltip from './TimelineTooltip';
import TimelineControls from './TimelineComponents/TimelineControls';
import { Card } from '../ui/card';
import { Activity } from 'lucide-react';

interface TimelineGraphProps {
  alerts: Alert[];
  onTimeRangeChange?: (start: Date, end: Date) => void;
}

const TimelineGraph = ({ alerts, onTimeRangeChange }: TimelineGraphProps) => {
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number } | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [timeGranularity, setTimeGranularity] = useState<'5min' | 'hour' | 'day'>('5min');

  const data = useMemo(() => processTimelineData(alerts, timeGranularity), [alerts, timeGranularity]);

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

  // Calculate summary statistics
  const summary = useMemo(() => {
    return {
      totalEvents: alerts.length,
      anomalies: alerts.filter(a => typeof a.dbscan_cluster === 'number' && a.dbscan_cluster === -1).length,
      severity: {
        high: alerts.filter(a => a.rule_level === 'high').length,
        medium: alerts.filter(a => a.rule_level === 'medium').length,
        low: alerts.filter(a => a.rule_level === 'low').length,
      }
    };
  }, [alerts]);

  return (
    <div className="w-full space-y-4">
      {/* Summary Widget */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-black/40 border-blue-500/10">
          <div className="flex items-center justify-between">
            <span className="text-blue-300">Total Events</span>
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-100">{summary.totalEvents}</p>
        </Card>
        <Card className="p-4 bg-black/40 border-blue-500/10">
          <div className="flex items-center justify-between">
            <span className="text-blue-300">Anomalies</span>
            <Activity className="h-4 w-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-blue-100">{summary.anomalies}</p>
        </Card>
        <Card className="p-4 bg-black/40 border-blue-500/10">
          <div className="flex items-center justify-between">
            <span className="text-blue-300">High Severity</span>
            <Activity className="h-4 w-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-blue-100">{summary.severity.high}</p>
        </Card>
        <Card className="p-4 bg-black/40 border-blue-500/10">
          <div className="flex items-center justify-between">
            <span className="text-blue-300">Medium/Low</span>
            <Activity className="h-4 w-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-blue-100">
            {summary.severity.medium + summary.severity.low}
          </p>
        </Card>
      </div>

      <div className="w-full h-[400px] relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl" />
        
        <div className="relative w-full h-full p-4 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:border-blue-500/30">
          <TimelineControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            selectedSeverity={selectedSeverity}
            onSeveritySelect={setSelectedSeverity}
            severities={severities}
            timeGranularity={timeGranularity}
            onGranularityChange={setTimeGranularity}
          />

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
            >
              <defs>
                {severities.map((severity) => (
                  <linearGradient
                    key={severity}
                    id={`color${severity}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={getSeverityColor(severity)}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={getSeverityColor(severity)}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
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
                interval="preserveStartEnd"
                minTickGap={50}
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
              
              {severities.map((severity) => (
                <Area
                  key={severity}
                  type="monotone"
                  dataKey={`counts.${severity}`}
                  name={`${severity} Events`}
                  stroke={getSeverityColor(severity)}
                  fill={`url(#color${severity})`}
                  strokeWidth={2}
                  dot={(props: any) => {
                    if (selectedSeverity && severity !== selectedSeverity) {
                      return null;
                    }
                    const hasAnomaly = props.payload.anomalies > 0;
                    return (
                      <g>
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={hasAnomaly ? 6 : 4}
                          fill={getSeverityColor(severity)}
                          stroke="#1a1f2c"
                          strokeWidth={2}
                          style={{ opacity: 0.8 }}
                        />
                        {hasAnomaly && (
                          <circle
                            cx={props.cx}
                            cy={props.cy}
                            r={8}
                            fill="none"
                            stroke={getSeverityColor(severity)}
                            strokeWidth={1}
                            style={{ opacity: 0.5 }}
                            className="animate-ping"
                          />
                        )}
                      </g>
                    );
                  }}
                  activeDot={{ 
                    r: 6, 
                    fill: getSeverityColor(severity),
                    stroke: '#93c5fd',
                    strokeWidth: 2
                  }}
                />
              ))}

              <Brush
                dataKey="fullDate"
                height={30}
                stroke="#3b82f6"
                fill="#1a1f2c"
                onChange={handleBrushChange}
                startIndex={zoomDomain?.start}
                endIndex={zoomDomain?.end}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TimelineGraph;