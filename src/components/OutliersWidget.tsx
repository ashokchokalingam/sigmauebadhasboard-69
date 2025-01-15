import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon, TrendingUp, Shield, Monitor, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceArea } from "recharts";
import { format } from "date-fns";
import React, { useState, useCallback } from 'react';
import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface MLOutlier {
  anomaly_count: number;
  first_seen: string;
  impacted_computers: string;
  last_seen: string;
  ml_description: string;
  origin_users: string | null;
  risk: number | null;
  severity: "high" | "medium" | "low" | "informational";
  source_ips: string | null;
  tactics: string | null;
  techniques: string | null;
  title: string;
}

interface ChartDataPoint {
  timestamp: string;
  firstSeen: string;
  lastSeen: string;
  count: number;
  risk: number;
  severity: string;
  title: string;
  description: string;
  tactics: string[];
  impactedComputers: string[];
  impactedUsers: string[];
}

interface ZoomState {
  left?: string;
  right?: string;
  refAreaLeft?: string;
  refAreaRight?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 p-4 rounded-lg border border-purple-500/20 backdrop-blur-sm">
        <p className="text-purple-300 font-medium mb-2">{data.title}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Anomalies:</span>
            <span className="text-white font-bold">{data.count}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Risk Score:</span>
            <span className="text-white font-bold">{typeof data.risk === 'number' ? data.risk : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">First Seen:</span>
            <span className="text-white">{format(new Date(data.firstSeen), 'MMM d, yyyy h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Last Seen:</span>
            <span className="text-white">{format(new Date(data.lastSeen), 'MMM d, yyyy h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Impacted Computers:</span>
            <span className="text-white">{data.impactedComputers.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Impacted Users:</span>
            <span className="text-white">{data.impactedUsers.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Tactics:</span>
            <span className="text-white">{data.tactics.join(', ') || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Severity:</span>
            <span className={`font-bold ${getSeverityColor(data.severity)}`}>
              {data.severity.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case "high":
      return "text-red-400";
    case "medium":
      return "text-yellow-400";
    case "low":
      return "text-green-400";
    default:
      return "text-blue-400";
  }
};

const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  const severityColors = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#10B981",
    informational: "#60A5FA"
  };
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={severityColors[payload.severity.toLowerCase()] || "#60A5FA"} 
      className="cursor-pointer hover:r-6 transition-all duration-300"
    />
  );
};

const getTimeOfDay = (hour: number): string => {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};

const formatAxisTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const timeOfDay = getTimeOfDay(date.getHours());
    return `${format(date, 'MMM d')} - ${timeOfDay}`;
  } catch (e) {
    console.error('Error formatting axis date:', e);
    return timestamp;
  }
};

const OutliersWidget = () => {
  const [zoomState, setZoomState] = useState<ZoomState>({});
  const [isGrouped, setIsGrouped] = useState(true);
  const [groupingInterval, setGroupingInterval] = useState<'hour' | 'day'>('day');
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 'auto']);
  const [zoomLevel, setZoomLevel] = useState([1]);

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['outliers'],
    queryFn: async () => {
      const response = await fetch('/api/outliers');
      if (!response.ok) {
        throw new Error('Failed to fetch outliers data');
      }
      const data = await response.json();
      return data.outliers as MLOutlier[];
    }
  });

  const calculateSeverityStats = () => {
    if (!apiResponse) return { total: 0, high: 0, medium: 0, low: 0 };
    
    return apiResponse.reduce((acc, outlier) => {
      acc.total++;
      switch (outlier.severity) {
        case 'high':
          acc.high++;
          break;
        case 'medium':
          acc.medium++;
          break;
        case 'low':
          acc.low++;
          break;
      }
      return acc;
    }, { total: 0, high: 0, medium: 0, low: 0 });
  };

  const calculateImpactedCounts = () => {
    if (!apiResponse) return { computers: 0, users: 0 };
    
    return apiResponse.reduce((acc, outlier) => {
      const computers = outlier.impacted_computers?.split(',').filter(Boolean) || [];
      const users = outlier.origin_users?.split(',').filter(Boolean) || [];
      
      return {
        computers: acc.computers + computers.length,
        users: acc.users + users.length
      };
    }, { computers: 0, users: 0 });
  };

  const chartData = React.useMemo(() => {
    if (!apiResponse) return [];

    const groupedData: { [key: string]: ChartDataPoint } = {};
    const interval = groupingInterval === 'hour' ? 'HH:00' : 'MMM d';

    apiResponse.forEach((outlier) => {
      const date = new Date(outlier.last_seen);
      const timeKey = isGrouped 
        ? `${format(date, interval)}-${getTimeOfDay(date.getHours())}`
        : outlier.last_seen;
      
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = {
          timestamp: outlier.last_seen,
          firstSeen: outlier.first_seen,
          lastSeen: outlier.last_seen,
          count: 0,
          risk: outlier.risk || 0, // Convert null to 0
          severity: outlier.severity,
          title: outlier.title,
          description: outlier.ml_description,
          tactics: outlier.tactics?.split(',') || [],
          impactedComputers: outlier.impacted_computers?.split(',') || [],
          impactedUsers: (outlier.origin_users || '').split(',').filter(Boolean),
        };
      }

      groupedData[timeKey].count += outlier.anomaly_count;
      groupedData[timeKey].risk = Math.max(groupedData[timeKey].risk, outlier.risk || 0);
    });

    return Object.values(groupedData)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [apiResponse, isGrouped, groupingInterval]);

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value);
    const baseMax = Math.max(...chartData.map(d => d.count));
    setYAxisDomain([0, baseMax / value[0]]);
  };

  const handleZoom = useCallback(() => {
    if (zoomState.refAreaLeft === zoomState.refAreaRight || !zoomState.refAreaRight) {
      setZoomState({});
      return;
    }

    let left = zoomState.refAreaLeft;
    let right = zoomState.refAreaRight;

    if (left && right && new Date(left).getTime() > new Date(right).getTime()) {
      [left, right] = [right, left];
    }

    setZoomState({
      left,
      right,
      refAreaLeft: undefined,
      refAreaRight: undefined,
    });
  }, [zoomState]);

  const handleMouseDown = useCallback((e: any) => {
    if (!e) return;
    setZoomState(prev => ({ ...prev, refAreaLeft: e.activeLabel }));
  }, []);

  const handleMouseMove = useCallback((e: any) => {
    if (!e) return;
    if (zoomState.refAreaLeft)
      setZoomState(prev => ({ ...prev, refAreaRight: e.activeLabel }));
  }, [zoomState.refAreaLeft]);

  const handleZoomOutReset = () => {
    setZoomState({});
    setYAxisDomain([0, 'auto']);
    setZoomLevel([1]);
  };

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-purple-900/20">
        <CardContent className="p-6">
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = calculateSeverityStats();
  const impactedCounts = calculateImpactedCounts();
  const mediumPercentage = Math.round((stats.medium / stats.total) * 100);
  const highSeverityCount = stats.high;

  return (
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-100">
            <AlertOctagon className="h-5 w-5 text-purple-500" />
            ML Outliers - Executive Summary
          </div>
          <div className="flex items-center gap-2">
            <Toggle
              pressed={isGrouped}
              onPressedChange={setIsGrouped}
              aria-label="Toggle data grouping"
            >
              {isGrouped ? 'Grouped' : 'Raw Data'}
            </Toggle>
            {isGrouped && (
              <Toggle
                pressed={groupingInterval === 'day'}
                onPressedChange={(pressed) => setGroupingInterval(pressed ? 'day' : 'hour')}
                aria-label="Toggle grouping interval"
              >
                {groupingInterval === 'day' ? 'Daily' : 'Hourly'}
              </Toggle>
            )}
            {Object.keys(zoomState).length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOutReset}
                className="text-purple-100"
              >
                Reset Zoom
              </Button>
            )}
          </div>
        </CardTitle>
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <AlertOctagon className="h-5 w-5 text-red-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-purple-200">Critical Insight</p>
              <p className="text-sm font-bold text-purple-100 truncate">
                {highSeverityCount} high-severity anomalies need investigation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <TrendingUp className="h-5 w-5 text-yellow-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-purple-200">Severity Distribution</p>
              <p className="text-sm font-bold text-purple-100 truncate">
                {mediumPercentage}% medium severity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <Monitor className="h-5 w-5 text-blue-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-purple-200">Impacted Systems</p>
              <p className="text-sm font-bold text-purple-100 truncate">
                {impactedCounts.computers} computers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <Users className="h-5 w-5 text-green-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-purple-200">Impacted Users</p>
              <p className="text-sm font-bold text-purple-100 truncate">
                {impactedCounts.users} users
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="relative">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleZoom}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: '#E2E8F0' }}
                  tickFormatter={formatAxisTimestamp}
                  domain={zoomState.left && zoomState.right ? [zoomState.left, zoomState.right] : ['auto', 'auto']}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={yAxisDomain}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Anomaly Count"
                  stroke="#9333EA"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  dot={<CustomizedDot />}
                />
                {zoomState.refAreaLeft && zoomState.refAreaRight && (
                  <ReferenceArea
                    x1={zoomState.refAreaLeft}
                    x2={zoomState.refAreaRight}
                    strokeOpacity={0.3}
                    fill="#9333EA"
                    fillOpacity={0.1}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-2 pt-4 bg-gradient-to-t from-black/40">
            <div className="flex items-center gap-4">
              <span className="text-xs text-purple-300 whitespace-nowrap">Zoom Level:</span>
              <div className="flex-1">
                <Slider
                  value={zoomLevel}
                  onValueChange={handleZoomChange}
                  min={0.5}
                  max={4}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutliersWidget;
