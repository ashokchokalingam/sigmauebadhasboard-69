import { Alert } from "./types";
import TimelineRawLog from "./TimelineRawLog";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { defaultColumns } from "./TableConfig";

interface AlertDetailsViewProps {
  alert: Alert;
}

const AlertDetailsView = ({ alert }: AlertDetailsViewProps) => {
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  return (
    <div className="space-y-4 p-4">
      {defaultColumns.map((column) => {
        if (column.key === 'raw') {
          return (
            <div key={column.key} className="bg-black/40 border border-blue-500/10 rounded-lg">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-500/5 transition-colors"
                onClick={() => setIsRawExpanded(!isRawExpanded)}
              >
                <h3 className="text-xl font-semibold text-blue-100">
                  {column.label}
                </h3>
                {isRawExpanded ? (
                  <ChevronUp className="h-6 w-6 text-blue-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-blue-400" />
                )}
              </div>
              {isRawExpanded && alert.raw && (
                <div className="p-4">
                  <TimelineRawLog alert={alert} />
                </div>
              )}
            </div>
          );
        }

        const value = alert[column.key as keyof Alert];
        if (!value) return null;

        return (
          <div key={column.key} className="space-y-2">
            <h3 className="text-sm font-medium text-blue-300">{column.label}</h3>
            <p className="text-blue-100 break-words">{String(value)}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AlertDetailsView;