interface DetailFieldProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

const DetailField = ({ label, value, icon, className = "" }: DetailFieldProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2">
        {icon}
        {label}
      </h4>
      <p className="text-sm text-blue-100 font-mono">
        {value || 'N/A'}
      </p>
    </div>
  );
};

export default DetailField;