import { Alert } from "./types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import TimelineRawLog from "./TimelineRawLog";
import { defaultColumns } from "./TableConfig";

interface AlertDetailsViewProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetailsView = ({ alert, onClose }: AlertDetailsViewProps) => {
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  return (
    <div className="p-6 space-y-4 w-full bg-black/40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-100">Alert Details</h2>
        <button 
          onClick={onClose}
          className="text-blue-400 hover:text-blue-300 transition-colors"
          aria-label="Close details"
        >
          ESC to close
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {defaultColumns.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <h3 className="text-sm font-medium text-blue-300">{label}</h3>
            <p className="text-blue-100">
              {alert[key as keyof Alert]?.toString() || 'N/A'}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 border-t border-blue-500/10 pt-4">
        <button
          className="w-full flex items-center justify-between p-4 hover:bg-blue-500/5 transition-colors rounded-lg"
          onClick={() => setIsRawExpanded(!isRawExpanded)}
        >
          <span className="text-lg font-semibold text-blue-100">Raw Data</span>
          {isRawExpanded ? (
            <ChevronUp className="h-6 w-6 text-blue-400" />
          ) : (
            <ChevronDown className="h-6 w-6 text-blue-400" />
          )}
        </button>
        {isRawExpanded && alert.raw && (
          <div className="mt-4">
            <TimelineRawLog alert={alert} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertDetailsView;