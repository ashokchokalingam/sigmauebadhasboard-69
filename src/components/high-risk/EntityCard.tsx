import { User } from "lucide-react";
import { RiskyEntity } from "./types";
import { useState, useEffect } from "react";

interface EntityCardProps {
  entity: RiskyEntity;
  entityType: 'user-origin' | 'user-impacted' | 'asset';
  showMetricCycle?: boolean;
}

const EntityCard = ({ entity, entityType, showMetricCycle = false }: EntityCardProps) => {
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);

  useEffect(() => {
    if (!showMetricCycle) return;

    const interval = setInterval(() => {
      setCurrentMetricIndex((prev) => (prev + 1) % 3);
    }, 1000);

    return () => clearInterval(interval);
  }, [showMetricCycle]);

  const getMetrics = (entity: RiskyEntity) => [
    { value: entity.unique_title_count || 0, label: 'unique anomalies' },
    { value: parseInt(entity.unique_tactics_count || '0'), label: 'unique tactics' },
    { value: entity.unique_outliers || 0, label: 'unique outliers' }
  ];

  const metrics = getMetrics(entity);
  const currentMetric = metrics[currentMetricIndex];
  const entityName = entityType === 'asset' ? entity.computer : entity.user;

  return (
    <div
      className="group relative p-5 rounded-xl
        bg-gradient-to-r from-[#0D0E12] to-[#0D0E12]/80
        border border-indigo-500/20 hover:border-indigo-500/30
        transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
            <User className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-mono text-lg text-indigo-100/90 font-medium group-hover:text-indigo-100">
              {entityName}
            </h3>
            <p className="text-sm text-indigo-400/70 font-medium transition-all duration-200">
              {currentMetric.value} {currentMetric.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-red-400 animate-pulse">
              Risk Level
            </span>
            <span className="text-xs font-medium text-red-400/70">
              Critical
            </span>
          </div>
          <div className="relative w-24 h-8 overflow-hidden opacity-70">
            <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 600 100" preserveAspectRatio="none">
              <path
                d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                className="stroke-red-500 fill-none stroke-[3]"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-mono font-bold text-3xl text-red-400 tabular-nums">
            {entity.cumulative_risk_score}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;