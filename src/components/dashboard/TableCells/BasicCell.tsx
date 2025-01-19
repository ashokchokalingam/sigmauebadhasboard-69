import BaseTableCell from "./BaseTableCell";

interface BasicCellProps {
  value: any;
}

const BasicCell = ({ value }: BasicCellProps) => {
  const formatValue = (val: any): string => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };
  
  return (
    <BaseTableCell 
      value={formatValue(value)}
      tooltipContent={formatValue(value)}
    />
  );
};

export default BasicCell;