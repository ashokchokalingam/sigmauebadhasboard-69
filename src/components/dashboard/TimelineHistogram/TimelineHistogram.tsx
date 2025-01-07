import { useState } from 'react';
import { Alert } from '../types';
import TimelineChart from './TimelineChart';
import TimelineControls from './TimelineControls';
import { Card } from '@/components/ui/card';
import { processTimelineData, TimeInterval } from './timelineUtils';

interface TimelineHistogramProps {
  alerts: Alert[];
}

const TimelineHistogram = ({ alerts }: TimelineHistogramProps) => {
  const [interval, setInterval] = useState<TimeInterval>('1h');
  const [viewMode, setViewMode] = useState<'count' | 'severity'>('count');
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const data = processTimelineData(alerts, interval);
  console.log('Processed timeline data:', data);

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
        </div>

        <TimelineControls
          interval={interval}
          onIntervalChange={setInterval}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
        />

        <TimelineChart
          data={data}
          viewMode={viewMode}
          zoomLevel={zoomLevel}
          onRangeSelect={setSelectedRange}
        />

        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/80" />
            <span className="text-sm text-blue-300/70">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500/80" />
            <span className="text-sm text-blue-300/70">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500/80" />
            <span className="text-sm text-blue-300/70">Medium/Low</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimelineHistogram;