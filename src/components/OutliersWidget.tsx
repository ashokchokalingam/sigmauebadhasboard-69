import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Toggle } from "@/components/ui/toggle";
import { MLOutlier, ChartDataPoint } from "./outliers/types";
import { OutlierStats } from "./outliers/OutlierStats";
import { OutlierChart } from "./outliers/OutlierChart";
import { format } from "date-fns";
import React, { useState } from 'react';

const OutliersWidget = () => {
  const [isGrouped, setIsGrouped] = useState(true);
  const [groupingInterval, setGroupingInterval] = useState<'hour' | 'day'>('day');

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
          risk: outlier.risk || 0,
          severity: outlier.severity,
          title: outlier.title,
          description: outlier.ml_description,
          tactics: outlier.tactics?.split(',') || [],
          impactedComputers: outlier.impacted_computers?.split(',') || [],
          impactedUsers: (outlier.origin_users || '').split(',').filter(Boolean),
        };
      }

      groupedData[timeKey].count += outlier.anomaly_count;
      
      if (outlier.risk !== null) {
        const currentRisk = Number(outlier.risk);
        if (!isNaN(currentRisk)) {
          groupedData[timeKey].risk = Math.max(groupedData[timeKey].risk, currentRisk);
        }
      }
    });

    return Object.values(groupedData)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [apiResponse, isGrouped, groupingInterval]);

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

  return (
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertOctagon className="h-7 w-7 text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                ML Outliers
              </h2>
              <p className="text-sm text-purple-300/80 font-medium">
                Executive Summary
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle
              className="data-[state=on]:bg-purple-800 data-[state=on]:text-purple-100"
              pressed={isGrouped}
              onPressedChange={setIsGrouped}
              aria-label="Toggle data grouping"
            >
              {isGrouped ? 'Grouped' : 'Raw Data'}
            </Toggle>
            {isGrouped && (
              <Toggle
                className="data-[state=on]:bg-purple-800 data-[state=on]:text-purple-100"
                pressed={groupingInterval === 'day'}
                onPressedChange={(pressed) => setGroupingInterval(pressed ? 'day' : 'hour')}
                aria-label="Toggle grouping interval"
              >
                {groupingInterval === 'day' ? 'Daily' : 'Hourly'}
              </Toggle>
            )}
          </div>
        </CardTitle>
        <OutlierStats stats={stats} impactedCounts={impactedCounts} />
      </CardHeader>
      <CardContent className="pt-2">
        <OutlierChart data={chartData} />
      </CardContent>
    </Card>
  );
};

const getTimeOfDay = (hour: number): string => {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};

export default OutliersWidget;