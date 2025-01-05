import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert } from "../types";

interface TimelineSummaryStatsProps {
  alerts: Alert[];
}

const TimelineSummaryStats = ({ alerts }: TimelineSummaryStatsProps) => {
  const summary = {
    totalEvents: alerts.length,
    anomalies: alerts.filter(a => typeof a.dbscan_cluster === 'number' && a.dbscan_cluster === -1).length,
    severity: {
      high: alerts.filter(a => a.rule_level === 'high').length,
      medium: alerts.filter(a => a.rule_level === 'medium').length,
      low: alerts.filter(a => a.rule_level === 'low').length,
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
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
  );
};

export default TimelineSummaryStats;