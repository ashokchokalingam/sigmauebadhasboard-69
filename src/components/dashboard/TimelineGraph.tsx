import React, { useMemo, useState, useCallback } from 'react';
import { Alert } from './types';
import { processTimelineData } from './utils/timelineDataUtils';
import TimelineControls from './TimelineComponents/TimelineControls';
import TimelineSummaryStats from './TimelineComponents/TimelineSummaryStats';
import TimelineBarChart from './TimelineComponents/TimelineBarChart';
import { Card } from '../ui/card';

interface TimelineGraphProps {
  alerts: Alert[];
  onTimeRangeChange?: (start: Date, end: Date) => void;
}

const TimelineGraph = ({ alerts, onTimeRangeChange }: TimelineGraphProps) => {
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number } | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [timeGranularity, setTimeGranularity] = useState<'5min' | 'hour' | 'day'>('hour');

  const data = useMemo(() => {
    console.log('Processing alerts:', alerts);
    const processedData = processTimelineData(alerts, timeGranularity);
    console.log('Processed timeline data:', processedData);
    return processedData;
  }, [alerts, timeGranularity]);

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

  if (!alerts || alerts.length === 0) {
    return (
      <Card className="p-6 bg-black/40 border-blue-500/10">
        <div className="text-center text-gray-400">
          No timeline data available
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-8">
      <TimelineSummaryStats alerts={alerts} />
      
      <Card className="p-6 bg-black/40 border-blue-500/10">
        <TimelineControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          selectedSeverity={selectedSeverity}
          onSeveritySelect={setSelectedSeverity}
          severities={severities}
          timeGranularity={timeGranularity}
          onGranularityChange={setTimeGranularity}
        />
        
        <TimelineBarChart
          data={data}
          onBrushChange={handleBrushChange}
          selectedSeverity={selectedSeverity}
          zoomDomain={zoomDomain}
        />
      </Card>
    </div>
  );
};

export default TimelineGraph;