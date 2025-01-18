import { TableCell } from "@/components/ui/table";
import { ReactNode } from "react";

interface BasicCellProps {
  value: string | number | ReactNode;
  className?: string;
}

const BasicCell = ({ value, className = "text-slate-200" }: BasicCellProps) => {
  return (
    <TableCell className={`px-6 ${className}`}>
      {value}
    </TableCell>
  );
};

export default BasicCell;