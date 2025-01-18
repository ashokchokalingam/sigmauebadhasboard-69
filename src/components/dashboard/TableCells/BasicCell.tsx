import { TableCell } from "@/components/ui/table";
import { ReactNode } from "react";

interface BasicCellProps {
  value: string | number | ReactNode;
}

const BasicCell = ({ value }: BasicCellProps) => {
  return (
    <TableCell className="px-4">
      <span className="text-xs">{value}</span>
    </TableCell>
  );
};

export default BasicCell;