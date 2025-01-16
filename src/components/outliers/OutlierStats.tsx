import { AlertOctagon, TrendingUp, Monitor, Users } from "lucide-react";
import { StatsData, ImpactedCounts } from "./types";

interface OutlierStatsProps {
  stats: StatsData;
  impactedCounts: ImpactedCounts;
}

export const OutlierStats = ({ stats, impactedCounts }: OutlierStatsProps) => {
  const mediumPercentage = Math.round((stats.medium / stats.total) * 100);
  
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      <div className="flex flex-col p-4 rounded-xl bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
        <div className="flex items-center gap-2 mb-2">
          <AlertOctagon className="h-6 w-6 text-red-400 animate-pulse" />
          <span className="text-purple-200/80 font-medium text-sm">Critical Insight</span>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-purple-300 bg-clip-text text-transparent">
          {stats.high}
        </h3>
        <p className="text-lg font-semibold text-purple-100 mt-1 leading-tight group-hover:text-purple-50 transition-colors">
          high-severity anomalies need investigation
        </p>
      </div>
      
      <div className="flex flex-col p-4 rounded-xl bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-6 w-6 text-yellow-400 animate-pulse" />
          <span className="text-purple-200/80 font-medium text-sm">Severity Distribution</span>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-purple-300 bg-clip-text text-transparent">
          {mediumPercentage}%
        </h3>
        <p className="text-lg font-semibold text-purple-100 mt-1 leading-tight group-hover:text-purple-50 transition-colors">
          medium severity alerts detected
        </p>
      </div>
      
      <div className="flex flex-col p-4 rounded-xl bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
        <div className="flex items-center gap-2 mb-2">
          <Monitor className="h-6 w-6 text-blue-400 animate-pulse" />
          <span className="text-purple-200/80 font-medium text-sm">Impacted Systems</span>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-purple-300 bg-clip-text text-transparent">
          {impactedCounts.computers}
        </h3>
        <p className="text-lg font-semibold text-purple-100 mt-1 leading-tight group-hover:text-purple-50 transition-colors">
          computers affected
        </p>
      </div>
      
      <div className="flex flex-col p-4 rounded-xl bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-6 w-6 text-green-400 animate-pulse" />
          <span className="text-purple-200/80 font-medium text-sm">Impacted Users</span>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-purple-400 to-purple-300 bg-clip-text text-transparent">
          {impactedCounts.users}
        </h3>
        <p className="text-lg font-semibold text-purple-100 mt-1 leading-tight group-hover:text-purple-50 transition-colors">
          users affected
        </p>
      </div>
    </div>
  );
};