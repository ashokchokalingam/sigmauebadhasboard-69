
import { Alert } from "../types";
import BaseTableCell from "./BaseTableCell";
import { getRiskScoreColor } from "../utils/colorUtils";
import { cn } from "@/lib/utils";

interface RiskScoreCellProps {
  alert: Alert;
}

const RiskScoreCell = ({ alert }: RiskScoreCellProps) => {
  return (
    <BaseTableCell value={alert.risk?.toString() || '-'}>
      <span className={cn(
        "font-mono font-bold",
        getRiskScoreColor(alert.risk)
      )}>
        {alert.risk || '-'}
      </span>
    </BaseTableCell>
  );
};

export default RiskScoreCell;
