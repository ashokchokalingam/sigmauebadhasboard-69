import { Activity, Shield, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert } from "../types";

interface TimelineMitreSummaryProps {
  alerts: Alert[];
}

const TimelineMitreSummary = ({ alerts }: TimelineMitreSummaryProps) => {
  const mitreStats = alerts.reduce((acc, alert) => {
    const tactics = alert.tags
      .split(',')
      .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
      .map(tag => tag.replace('attack.', ''));
    
    const techniques = alert.tags
      .split(',')
      .filter(tag => tag.toLowerCase().includes('t1'));

    tactics.forEach(tactic => {
      acc.tactics[tactic] = (acc.tactics[tactic] || 0) + 1;
    });

    techniques.forEach(technique => {
      acc.techniques[technique] = (acc.techniques[technique] || 0) + 1;
    });

    return acc;
  }, { tactics: {}, techniques: {} } as { tactics: Record<string, number>, techniques: Record<string, number> });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">MITRE Tactics</span>
          </div>
          <Shield className="h-5 w-5 text-pink-400 animate-pulse" />
        </div>
        <div className="space-y-3">
          {Object.entries(mitreStats.tactics).map(([tactic, count]) => (
            <div key={tactic} className="flex items-center justify-between group">
              <span className="text-sm text-purple-200/90 capitalize transition-colors duration-200 group-hover:text-purple-200">
                {tactic.replace(/_/g, ' ')}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-pink-400/90 transition-colors duration-200 group-hover:text-pink-400">{count}</span>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-400" />
            <span className="text-blue-300 font-semibold">MITRE Techniques</span>
          </div>
          <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
        </div>
        <div className="space-y-3">
          {Object.entries(mitreStats.techniques).map(([technique, count]) => (
            <div key={technique} className="flex items-center justify-between group">
              <span className="text-sm font-mono text-blue-200/90 transition-colors duration-200 group-hover:text-blue-200">
                {technique}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-cyan-400/90 transition-colors duration-200 group-hover:text-cyan-400">{count}</span>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TimelineMitreSummary;