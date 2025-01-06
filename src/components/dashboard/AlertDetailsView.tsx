import { Alert } from "./types";
import { X } from "lucide-react";
import TimelineRawLog from "./TimelineRawLog";
import { Card } from "@/components/ui/card";
import AlertIdentification from "./AlertDetailsSections/AlertIdentification";
import MitreInfo from "./AlertDetailsSections/MitreInfo";
import SystemInfo from "./AlertDetailsSections/SystemInfo";

interface AlertDetailsViewProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetailsView = ({ alert, onClose }: AlertDetailsViewProps) => {
  const browserTime = new Date(alert.system_time).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  // Handle ESC key
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  // Add event listener for ESC key
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="h-full bg-[#1E1E2F] border-l border-[#7B68EE]/20">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-[#7B68EE]/20 bg-[#1E1E2F] backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
          Alert Details
        </h2>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            onClose();
          }}
          className="p-2 hover:bg-[#2B2B3B] rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-[#A9A9A9]" />
        </button>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-4rem)] overflow-y-auto">
        <div className="p-4 space-y-4">
          <AlertIdentification alert={alert} />
          <MitreInfo alert={alert} />
          <SystemInfo alert={alert} browserTime={browserTime} />
          <Card className="bg-[#2B2B3B] border-[#7B68EE]/20">
            <TimelineRawLog alert={alert} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsView;