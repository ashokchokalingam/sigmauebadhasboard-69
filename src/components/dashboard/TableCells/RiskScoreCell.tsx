
import { Alert } from "../types";
import BaseTableCell from "./BaseTableCell";
import { getRiskScoreColor } from "../utils/colorUtils";

interface RiskScoreCellProps {
  alert: Alert;
}

const RiskScoreCell = ({ alert }: RiskScoreCellProps) => {
  const value = alert.risk?.toString() || '-';
  const colorClass = getRiskScoreColor(alert.risk);
  
  return (
    <BaseTableCell 
      value={value} 
      className={`font-mono font-bold ${colorClass}`}
    />
  );
};

export default RiskScoreCell;
