import BaseTableCell from "./BaseTableCell";

interface BasicCellProps {
  value: React.ReactNode;
}

const BasicCell = ({ value }: BasicCellProps) => {
  const content = typeof value === 'string' ? value : 'N/A';
  
  return (
    <BaseTableCell 
      value={content}
      tooltipContent={content}
    />
  );
};

export default BasicCell;