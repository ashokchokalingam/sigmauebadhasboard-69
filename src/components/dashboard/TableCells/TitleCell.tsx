import { TableCell } from "@/components/ui/table";
import { FileText } from "lucide-react";

interface TitleCellProps {
  title: string;
}

const TitleCell = ({ title }: TitleCellProps) => {
  return (
    <TableCell className="px-2 py-0 min-w-[200px] max-w-[300px]">
      <div className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
        <FileText className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
        <span className="text-[13px] truncate">{title || '-'}</span>
      </div>
    </TableCell>
  );
};

export default TitleCell;