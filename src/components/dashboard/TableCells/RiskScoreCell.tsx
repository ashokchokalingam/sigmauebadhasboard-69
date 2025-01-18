import { AlertTriangle } from "lucide-react";
import BaseTableCell from "./BaseTableCell";

interface RiskScoreCellProps {
  risk: number | null;
}

const RiskScoreCell = ({ risk }: RiskScoreCellProps) => {
  const getRiskColor = (risk: number | null) => {
    if (!risk) return "text-slate-400";
    if (risk >= 80) return "text-red-400";
    if (risk >= 50) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <BaseTableCell 
      value={risk || 'N/A'}
      icon={AlertTriangle}
      width="w-[80px]"
      tooltipContent={`Risk Score: ${risk || 'N/A'}`}
      className={`font-medium ${getRiskColor(risk)}`}
      align="center"
    />
  );
};

export default RiskScoreCell;