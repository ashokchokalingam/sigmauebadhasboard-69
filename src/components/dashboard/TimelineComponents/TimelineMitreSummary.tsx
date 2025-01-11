import { Activity, Shield } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 bg-black/40 border-blue-500/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-blue-300 font-semibold">MITRE Tactics</span>
          <Shield className="h-4 w-4 text-purple-400" />
        </div>
        <div className="space-y-2">
          {Object.entries(mitreStats.tactics).map(([tactic, count]) => (
            <div key={tactic} className="flex items-center justify-between">
              <span className="text-sm text-blue-200 capitalize">
                {tactic.replace(/_/g, ' ')}
              </span>
              <span className="text-sm font-mono text-purple-400">{count}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-black/40 border-blue-500/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-blue-300 font-semibold">MITRE Techniques</span>
          <Activity className="h-4 w-4 text-blue-400" />
        </div>
        <div className="space-y-2">
          {Object.entries(mitreStats.techniques).map(([technique, count]) => (
            <div key={technique} className="flex items-center justify-between">
              <span className="text-sm font-mono text-blue-200">{technique}</span>
              <span className="text-sm font-mono text-blue-400">{count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TimelineMitreSummary;