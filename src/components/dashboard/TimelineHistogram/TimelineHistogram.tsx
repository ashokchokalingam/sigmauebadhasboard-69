import { Alert } from '../types';
import TimelineChart from './TimelineChart';
import { Card } from '@/components/ui/card';
import { processTimelineData } from './timelineUtils';

interface TimelineHistogramProps {
  alerts: Alert[];
}

const TimelineHistogram = ({ alerts }: TimelineHistogramProps) => {
  const data = processTimelineData(alerts);

  return (
    <Card className="p-4 bg-black/40 border-blue-500/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-blue-100">Event Distribution</h3>
            <p className="text-sm text-blue-300/70">
              Number of events over time
            </p>
          </div>
        </div>

        <TimelineChart
          data={data}
          viewMode="count"
        />
      </div>
    </Card>
  );
};

export default TimelineHistogram;