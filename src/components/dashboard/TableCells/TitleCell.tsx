import { TableCell } from "@/components/ui/table";
import { FileText } from "lucide-react";

interface TitleCellProps {
  title: string;
}

const TitleCell = ({ title }: TitleCellProps) => {
  return (
    <TableCell className="px-4">
      <div className="flex items-center gap-2">
        <FileText className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-xs">{title || '-'}</span>
      </div>
    </TableCell>
  );
};

export default TitleCell;