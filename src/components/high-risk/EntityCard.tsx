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
    }, 3000);

    return () => clearInterval(interval);
  }, [showMetricCycle]);

  const getMetricValue = (value: number | string | undefined) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseInt(value) || 0;
    return 0;
  };

  const getMetrics = (entity: RiskyEntity) => [
    { 
      value: getMetricValue(entity.unique_title_count),
      label: 'unique anomalies' 
    },
    { 
      value: getMetricValue(entity.unique_tactics_count),
      label: 'unique tactics' 
    },
    { 
      value: getMetricValue(entity.unique_outliers),
      label: 'unique outliers' 
    }
  ];

  const metrics = getMetrics(entity);
  const currentMetric = showMetricCycle ? metrics[currentMetricIndex] : metrics[0];
  const entityName = entityType === 'asset' ? entity.computer : entity.user;

  return (
    <div className="group relative p-3 rounded-lg
      bg-gradient-to-r from-[#0D0E12] to-[#0D0E12]/80
      border border-indigo-500/20 hover:border-indigo-500/30
      transition-all duration-300 cursor-pointer
      hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
            <User className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-mono text-sm text-indigo-100/90 font-medium group-hover:text-indigo-100 truncate max-w-[150px]">
              {entityName}
            </h3>
            <p className="text-xs text-indigo-400/70 font-medium">
              {currentMetric.value} {currentMetric.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-16 h-6 overflow-hidden opacity-70">
            <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 600 100" preserveAspectRatio="none">
              <path
                d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                className="stroke-red-500 fill-none stroke-[3]"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-mono font-bold text-lg text-red-400 tabular-nums">
            {entity.cumulative_risk_score}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;