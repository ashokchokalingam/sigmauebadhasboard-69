import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MetadataFieldProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null;
  isRawLog?: boolean;
}

const MetadataField = ({ icon: Icon, label, value, isRawLog = false }: MetadataFieldProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayValue = value === null || value === undefined || value === '' ? 'N/A' : 
    typeof value === 'object' ? JSON.stringify(value) : String(value);

  const shouldTruncate = isRawLog && displayValue.length > 200 && !isExpanded;
  const truncatedValue = shouldTruncate ? `${displayValue.slice(0, 200)}...` : displayValue;

  return (
    <div className="flex flex-col gap-2 p-4 bg-sidebar/20 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-blue-400" />
          <p className="text-sm font-medium text-blue-400">{label}</p>
        </div>
        {isRawLog && displayValue.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>
      <div className={`text-sm text-blue-100 font-mono break-all ${isRawLog ? 'whitespace-pre-wrap' : ''}`}>
        {truncatedValue}
      </div>
    </div>
  );
};

export default MetadataField;