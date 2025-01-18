import { TableCell } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface TitleCellProps {
  title: string;
}

const TitleCell = ({ title }: TitleCellProps) => {
  return (
    <TableCell className="px-3 py-2 flex-1 min-w-[200px]">
      <Tooltip content={title}>
        <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
          <FileText className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <span className="text-[13px] truncate text-left">{title || '-'}</span>
        </div>
      </Tooltip>
    </TableCell>
  );
};

export default TitleCell;