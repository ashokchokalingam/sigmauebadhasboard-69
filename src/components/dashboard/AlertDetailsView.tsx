import React from 'react';
import { Alert } from "./types";
import TimelineRawLog from "./TimelineRawLog";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import AlertIdentification from "./AlertDetailsSections/AlertIdentification";
import AlertTacticsSection from "./AlertDetailsSections/AlertTacticsSection";
import AlertMetadata from "./AlertDetailsSections/AlertMetadata";

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

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="h-full bg-[#1A1A2E] border-l border-[#2D2D44]">
      <div className="flex items-center justify-between p-4 border-b border-[#2D2D44]">
        <h2 className="text-lg font-semibold text-purple-300">Alert Details</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#2D2D44] rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-purple-300" />
        </button>
      </div>

      <div className="h-[calc(100%-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
        <div className="p-4 space-y-4">
          <AlertIdentification alert={alert} />
          <AlertTacticsSection tags={alert.tags} />
          <AlertMetadata alert={alert} browserTime={browserTime} />
          <Card className="bg-[#2D2D44] border-[#4D4D64]">
            <TimelineRawLog alert={alert} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsView;