import { AlertOctagon, TrendingUp, Monitor, Users } from "lucide-react";
import { StatsData, ImpactedCounts } from "./types";

interface OutlierStatsProps {
  stats: StatsData;
  impactedCounts: ImpactedCounts;
}

export const OutlierStats = ({ stats, impactedCounts }: OutlierStatsProps) => {
  const mediumPercentage = Math.round((stats.medium / stats.total) * 100);
  
  return (
    <div className="grid grid-cols-4 gap-2 mt-2">
      <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
        <AlertOctagon className="h-5 w-5 text-red-400 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-purple-200">Critical Insight</p>
          <p className="text-sm font-bold text-purple-100 truncate">
            {stats.high} high-severity anomalies need investigation
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
  );
};