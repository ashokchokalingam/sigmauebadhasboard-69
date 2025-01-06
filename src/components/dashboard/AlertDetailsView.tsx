import React from 'react';
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
    <div className="h-full bg-[#1E1E2F] border-l border-[#7B68EE]/20">
      <div className="flex justify-between items-center p-4 border-b border-[#7B68EE]/20 bg-[#1E1E2F] backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
          Alert Details
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#2B2B3B] rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-[#A9A9A9]" />
        </button>
      </div>

      <div className="h-[calc(100%-4rem)] overflow-y-auto">
        <div className="p-4 space-y-8">
          <div className="space-y-8">
            <AlertIdentification alert={alert} />
            <MitreInfo alert={alert} />
            
            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-3">Event Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Event ID</h4>
                  <p className="text-sm text-[#E0E0E0] font-mono">{alert.event_id || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Provider Name</h4>
                  <p className="text-sm text-[#E0E0E0] font-mono">{alert.provider_name || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Task</h4>
                  <p className="text-sm text-[#E0E0E0] font-mono">{alert.task || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Rule Level</h4>
                  <p className="text-sm text-[#E0E0E0] font-mono">{alert.rule_level || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Rule ID</h4>
                  <p className="text-sm text-[#E0E0E0] font-mono">{alert.ruleid || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">DBSCAN Cluster</h4>
                  <p className="text-sm text-[#E0E0E0] font-mono">{alert.dbscan_cluster || 'N/A'}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-3">User Information</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">User ID</h4>
                  <p className="text-sm text-[#E0E0E0] font-mono">{alert.user_id || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Target User</h4>
                  <p className="text-sm text-[#E0E0E0] font-mono">{alert.target_user_name || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Target Domain</h4>
                  <p className="text-sm text-[#E0E0E0] font-mono">{alert.target_domain_name || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">IP Address</h4>
                  <p className="text-sm text-[#E0E0E0] font-mono">{alert.ip_address || 'N/A'}</p>
                </div>
              </div>
            </Card>

            <SystemInfo alert={alert} browserTime={browserTime} />

            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20">
              <TimelineRawLog alert={alert} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsView;