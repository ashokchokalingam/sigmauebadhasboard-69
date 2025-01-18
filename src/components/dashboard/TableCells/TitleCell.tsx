import { TableCell } from "@/components/ui/table";
import { FileText } from "lucide-react";

interface TitleCellProps {
  title: string;
}

const TitleCell = ({ title }: TitleCellProps) => {
  return (
    <TableCell className="px-3 py-0 max-w-[250px]">
      <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
        <FileText className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
        <span className="text-[13px] truncate">{title || '-'}</span>
      </div>
    </TableCell>
  );
};

export default TitleCell;