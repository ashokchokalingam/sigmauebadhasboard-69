import { TableCell } from "@/components/ui/table";
import { FileText } from "lucide-react";

interface TitleCellProps {
  title: string;
}

const TitleCell = ({ title }: TitleCellProps) => {
  return (
    <TableCell className="px-6">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-slate-400" />
        <span>{title || '-'}</span>
      </div>
    </TableCell>
  );
};

export default TitleCell;