import { TableCell } from "@/components/ui/table";

interface RiskScoreCellProps {
  risk: number | null;
}

const RiskScoreCell = ({ risk }: RiskScoreCellProps) => {
  const getRiskColor = (risk: number | null) => {
    if (risk === null) return "text-gray-400";
    if (risk >= 80) return "text-red-400";
    if (risk >= 60) return "text-orange-400";
    if (risk >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <TableCell className="px-3 py-2 w-[150px] flex-shrink-0">
      <span className={`text-sm font-medium ${getRiskColor(risk)} text-right block`}>
        {risk === null ? 'N/A' : `${risk}%`}
      </span>
    </TableCell>
  );
};

export default RiskScoreCell;