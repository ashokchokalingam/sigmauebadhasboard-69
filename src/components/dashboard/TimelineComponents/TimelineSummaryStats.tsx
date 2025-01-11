import { Activity, Shield, AlertTriangle, CheckCircle } from "lucide-react";
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
      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-300 font-semibold">Total Events</span>
          <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
        </div>
        <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {summary.totalEvents}
        </p>
      </Card>
      
      <Card className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-red-300 font-semibold">Critical/High</span>
          <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
        </div>
        <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
          {summary.severity.critical + summary.severity.high}
        </p>
      </Card>
      
      <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-yellow-300 font-semibold">Medium</span>
          <Shield className="h-5 w-5 text-yellow-400 animate-pulse" />
        </div>
        <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
          {summary.severity.medium}
        </p>
      </Card>
      
      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-300 font-semibold">Low</span>
          <CheckCircle className="h-5 w-5 text-green-400 animate-pulse" />
        </div>
        <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
          {summary.severity.low}
        </p>
      </Card>
    </div>
  );
};

export default TimelineSummaryStats;