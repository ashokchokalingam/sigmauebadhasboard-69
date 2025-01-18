import { TableCell } from "@/components/ui/table";
import { AlignLeft } from "lucide-react";

interface DescriptionCellProps {
  description: string;
}

const DescriptionCell = ({ description }: DescriptionCellProps) => {
  return (
    <TableCell className="px-3 py-0">
      <div className="flex items-center gap-2">
        <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-[13px] text-slate-200/70 line-clamp-1">{description || '-'}</span>
      </div>
    </TableCell>
  );
};

export default DescriptionCell;