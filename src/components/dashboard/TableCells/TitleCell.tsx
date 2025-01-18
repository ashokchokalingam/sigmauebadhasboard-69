import { TableCell } from "@/components/ui/table";
import { FileText } from "lucide-react";

interface TitleCellProps {
  title: string;
}

const TitleCell = ({ title }: TitleCellProps) => {
  return (
    <TableCell className="min-w-[300px] px-6">
      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-1.5 bg-slate-800/50 rounded-md">
            <FileText className="h-4 w-4 text-slate-300" />
          </div>
          <span className="text-sm font-medium text-slate-300">Title</span>
        </div>
        <p className="text-[15px] text-slate-200 pl-8 line-clamp-2">
          {title || 'N/A'}
        </p>
      </div>
    </TableCell>
  );
};

export default TitleCell;