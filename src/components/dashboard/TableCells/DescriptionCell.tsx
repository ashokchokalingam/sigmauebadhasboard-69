import { TableCell } from "@/components/ui/table";
import { AlignLeft } from "lucide-react";

interface DescriptionCellProps {
  description: string;
}

const DescriptionCell = ({ description }: DescriptionCellProps) => {
  return (
    <TableCell className="px-2 py-0 min-w-[200px] max-w-[400px]">
      <div className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
        <AlignLeft className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
        <span className="text-[13px] text-slate-200/70 truncate">{description || '-'}</span>
      </div>
    </TableCell>
  );
};

export default DescriptionCell;