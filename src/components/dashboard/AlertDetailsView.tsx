import { Alert } from "./types";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import AlertDetailsHeader from "./AlertDetailsHeader";
import AlertIdentification from "./AlertDetailsSections/AlertIdentification";
import AlertMainInfo from "./AlertDetailsSections/AlertMainInfo";
import MitreInfo from "./AlertDetailsSections/MitreInfo";
import SystemInfo from "./AlertDetailsSections/SystemInfo";

interface AlertDetailsViewProps {
  alert: Alert | null;
  onClose: () => void;
}

const AlertDetailsView = ({ alert, onClose }: AlertDetailsViewProps) => {
  if (!alert) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Fixed header with blur effect */}
      <div className="sticky top-0 z-20 bg-black/40 backdrop-blur-sm border-b border-purple-500/10">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold text-purple-100">{alert.title || 'Alert Details'}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-950/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4 space-y-6">
          <AlertDetailsHeader alert={alert} />
          <AlertMainInfo alert={alert} />
          <AlertIdentification alert={alert} />
          <MitreInfo alert={alert} />
          <SystemInfo alert={alert} />
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsView;