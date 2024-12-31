import { Alert } from "./types";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineRawLog from "./TimelineRawLog";
import AlertDetailsHeader from "./AlertDetailsHeader";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AlertDetailsViewProps {
  alert: Alert;
}

const AlertDetailsView = ({ alert }: AlertDetailsViewProps) => {
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <AlertDetailsHeader alert={alert} />
      <TimelineMitreSection alert={alert} />
      
      {alert.raw && (
        <div className="bg-black/40 border border-blue-500/10 rounded-lg">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-500/5 transition-colors"
            onClick={() => setIsRawExpanded(!isRawExpanded)}
          >
            <h3 className="text-xl font-semibold text-blue-100">
              Raw Log Data
            </h3>
            {isRawExpanded ? (
              <ChevronUp className="h-6 w-6 text-blue-400" />
            ) : (
              <ChevronDown className="h-6 w-6 text-blue-400" />
            )}
          </div>
          {isRawExpanded && (
            <div className="p-4">
              <TimelineRawLog alert={alert} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertDetailsView;