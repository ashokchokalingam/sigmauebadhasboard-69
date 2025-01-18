import { cn } from "@/lib/utils";
import { getRiskColor } from "./utils/colorUtils";

interface EntityCardRiskIndicatorProps {
  riskScore: string | null;
  riskLevel: string;
}

const EntityCardRiskIndicator = ({ riskScore, riskLevel }: EntityCardRiskIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center w-10">
        <span className={cn("text-sm font-medium", getRiskColor(riskLevel))}>
          Risk
        </span>
        <span className={cn("text-xs font-medium", getRiskColor(riskLevel))}>
          {riskLevel}
        </span>
      </div>
      <div className="relative w-16 h-6 overflow-hidden">
        <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 600 100" preserveAspectRatio="none">
          <path
            d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
            className={cn("stroke-current fill-none stroke-[3]", getRiskColor(riskLevel))}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className={cn("font-mono font-bold text-2xl tabular-nums", getRiskColor(riskLevel))}>
        {riskScore}
      </span>
    </div>
  );
};

export default EntityCardRiskIndicator;