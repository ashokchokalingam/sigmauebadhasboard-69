import { Card } from "@/components/ui/card";
import { Alert } from "../types";
import TimelineChart from "./TimelineChart";
import TimelineControls from "./TimelineControls";
import { useState } from "react";

interface TimelineChartContainerProps {
  alerts: Alert[];
}

const TimelineChartContainer = ({ alerts }: TimelineChartContainerProps) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

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
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          selectedSeverity={selectedSeverity}
          onSeveritySelect={setSelectedSeverity}
        />

        <TimelineChart
          alerts={alerts}
          timeRange={timeRange}
          selectedSeverity={selectedSeverity}
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

export default TimelineChartContainer;