import { TableCell } from "@/components/ui/table";

interface BasicCellProps {
  value: string | number | null;
  className?: string;
}

const BasicCell = ({ value, className = "text-blue-100" }: BasicCellProps) => {
  return (
    <TableCell className={`px-6 ${className}`}>
      {value || 'N/A'}
    </TableCell>
  );
};

export default BasicCell;