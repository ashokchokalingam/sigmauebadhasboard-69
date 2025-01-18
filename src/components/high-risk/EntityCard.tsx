import { User, Computer } from "lucide-react";
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
      label: 'unique outliers' 
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

  const getRiskLevel = (score: number) => {
    if (score >= 200) return "critical";
    if (score >= 50) return "high";
    return "low";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "low":
        return "text-green-500";
      default:
        return "text-blue-500";
    }
  };

  const metrics = getMetrics(entity);
  const currentMetric = showMetricCycle ? metrics[currentMetricIndex] : metrics[0];
  const entityName = entityType === 'asset' ? entity.computer : entity.user;
  const riskScore = getMetricValue(entity.cumulative_risk_score);
  const riskLevel = getRiskLevel(riskScore);
  const riskColor = getRiskColor(riskLevel);

  return (
    <div className="group relative p-3 rounded-lg
      bg-[#0D0E12]/90 hover:bg-[#0D0E12]
      border border-blue-500/10 hover:border-blue-500/20
      transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
            {entityType === 'asset' ? (
              <Computer className="h-4 w-4 text-blue-400/70" />
            ) : (
              <User className="h-4 w-4 text-blue-400/70" />
            )}
          </div>
          <div className="space-y-0.5">
            <h3 className="font-mono text-base text-blue-100/90 font-medium group-hover:text-blue-100 truncate max-w-[150px]">
              {entityName}
            </h3>
            <p className="text-sm text-blue-400/70">
              {currentMetric.value} {currentMetric.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end mr-2">
            <span className={`text-sm font-medium ${riskColor}`}>
              Risk
            </span>
            <span className={`text-xs font-medium -mt-0.5 ${riskColor}`}>
              {riskLevel}
            </span>
          </div>
          <div className="relative w-16 h-6 overflow-hidden opacity-70">
            <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 600 100" preserveAspectRatio="none">
              <path
                d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                className={`fill-none stroke-[3] ${riskColor.replace('text-', 'stroke-')}`}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className={`font-mono font-bold text-2xl tabular-nums ${riskColor}`}>
            {riskScore}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;