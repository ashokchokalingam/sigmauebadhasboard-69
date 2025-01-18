import { TableCell } from "@/components/ui/table";
import { ReactNode } from "react";

interface BasicCellProps {
  value: string | number | ReactNode;
}

const BasicCell = ({ value }: BasicCellProps) => {
  return (
    <TableCell className="px-2 py-0 w-[150px] flex-shrink-0">
      <span className="text-[13px] truncate">{value}</span>
    </TableCell>
  );
};

export default BasicCell;