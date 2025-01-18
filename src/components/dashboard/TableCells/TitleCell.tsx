import { FileText } from "lucide-react";
import BaseTableCell from "./BaseTableCell";

interface TitleCellProps {
  title: string;
}

const TitleCell = ({ title }: TitleCellProps) => {
  return (
    <BaseTableCell 
      value={title || '-'}
      icon={FileText}
      width="min-w-[180px] max-w-[300px]"
      tooltipContent={title}
    />
  );
};

export default TitleCell;