import { TableCell } from "@/components/ui/table";
import { AlignLeft } from "lucide-react";

interface DescriptionCellProps {
  description: string;
}

const DescriptionCell = ({ description }: DescriptionCellProps) => {
  return (
    <TableCell className="px-6">
      <div className="flex items-center gap-2">
        <AlignLeft className="h-4 w-4 text-slate-400" />
        <span className="text-slate-200/70 line-clamp-2">{description || '-'}</span>
      </div>
    </TableCell>
  );
};

export default DescriptionCell;