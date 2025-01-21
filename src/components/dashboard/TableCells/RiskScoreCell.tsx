import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import BaseTableCell from "./BaseTableCell";
import { cn } from "@/lib/utils";

interface RiskScoreCellProps {
  risk: number | null;
}

const RiskScoreCell = ({ risk }: RiskScoreCellProps) => {
  const getRiskColor = (risk: number | null) => {
    if (!risk) return "text-slate-400";
    if (risk >= 80) return "text-risk-critical";
    if (risk >= 50) return "text-risk-medium";
    return "text-risk-low";
  };

  const getRiskIcon = (risk: number | null) => {
    if (!risk) return null;
    if (risk >= 80) return AlertTriangle;
    if (risk >= 50) return AlertCircle;
    return CheckCircle;
  };

  const getRiskBg = (risk: number | null) => {
    if (!risk) return "";
    if (risk >= 80) return "bg-risk-critical-glow";
    if (risk >= 50) return "bg-risk-high-glow";
    return "bg-risk-low-glow";
  };

  const Icon = getRiskIcon(risk);

  return (
    <BaseTableCell 
      value={
        <div className="flex items-center gap-2">
          {Icon && <Icon className={cn("h-4 w-4", getRiskColor(risk))} />}
          <span className="font-medium">{risk || 'N/A'}</span>
        </div>
      }
      width="w-[100px]"
      tooltipContent={`Risk Score: ${risk || 'N/A'}`}
      className={cn(
        "font-medium rounded-md",
        getRiskColor(risk),
        getRiskBg(risk),
        "px-2 py-1"
      )}
      align="center"
    />
  );
};

export default RiskScoreCell;