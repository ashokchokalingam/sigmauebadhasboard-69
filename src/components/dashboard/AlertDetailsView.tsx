import { Alert } from "./types";
import { X } from "lucide-react";
import TimelineRawLog from "./TimelineRawLog";
import AlertIdentification from "./AlertDetailsSections/AlertIdentification";
import AlertMainInfo from "./AlertDetailsSections/AlertMainInfo";
import MitreInfo from "./AlertDetailsSections/MitreInfo";
import SystemInfo from "./AlertDetailsSections/SystemInfo";

interface AlertDetailsViewProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetailsView = ({ alert, onClose }: AlertDetailsViewProps) => {
  return (
    <div className="h-full bg-black/90 border-l border-blue-500/10">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-blue-500/10 bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Alert Details
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-blue-400" />
        </button>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-5rem)] grid grid-rows-[auto_1fr]">
        <div className="p-6 space-y-8 overflow-y-auto">
          <AlertIdentification alert={alert} />
          <AlertMainInfo alert={alert} />
          <MitreInfo alert={alert} />
          <SystemInfo alert={alert} />
        </div>

        {/* Raw Log Section - Full Height */}
        <div className="border-t border-blue-500/10">
          <div className="p-6">
            <TimelineRawLog alert={alert} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsView;