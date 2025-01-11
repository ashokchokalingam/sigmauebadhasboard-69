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
      critical: alerts.filter(a => a.rule_level?.toLowerCase() === 'critical').length,
      high: alerts.filter(a => a.rule_level?.toLowerCase() === 'high').length,
      medium: alerts.filter(a => a.rule_level?.toLowerCase() === 'medium').length,
      low: alerts.filter(a => a.rule_level?.toLowerCase() === 'low').length,
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4 bg-black/40 border-blue-500/10">
        <div className="flex items-center justify-between">
          <span className="text-blue-300">Total Events</span>
          <Activity className="h-4 w-4 text-blue-400" />
        </div>
        <p className="text-2xl font-bold text-blue-100 mt-2">{summary.totalEvents}</p>
      </Card>
      
      <Card className="p-4 bg-black/40 border-blue-500/10">
        <div className="flex items-center justify-between">
          <span className="text-red-300">Critical/High</span>
          <Activity className="h-4 w-4 text-red-400" />
        </div>
        <p className="text-2xl font-bold text-red-100 mt-2">
          {summary.severity.critical + summary.severity.high}
        </p>
      </Card>
      
      <Card className="p-4 bg-black/40 border-blue-500/10">
        <div className="flex items-center justify-between">
          <span className="text-yellow-300">Medium</span>
          <Activity className="h-4 w-4 text-yellow-400" />
        </div>
        <p className="text-2xl font-bold text-yellow-100 mt-2">{summary.severity.medium}</p>
      </Card>
      
      <Card className="p-4 bg-black/40 border-blue-500/10">
        <div className="flex items-center justify-between">
          <span className="text-green-300">Low</span>
          <Activity className="h-4 w-4 text-green-400" />
        </div>
        <p className="text-2xl font-bold text-green-100 mt-2">{summary.severity.low}</p>
      </Card>
    </div>
  );
};

export default TimelineSummaryStats;