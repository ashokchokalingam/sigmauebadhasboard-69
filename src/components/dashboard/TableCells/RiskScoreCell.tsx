import { TableCell } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TableCell className="px-2 py-1.5 w-[100px] flex-shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <AlertTriangle className={`h-3.5 w-3.5 flex-shrink-0 ${getRiskColor(risk)}`} />
              <span className={`text-[13px] font-medium ${getRiskColor(risk)}`}>
                {risk || 'N/A'}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Risk Score: {risk || 'N/A'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};

export default RiskScoreCell;