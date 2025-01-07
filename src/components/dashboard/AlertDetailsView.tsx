import React from 'react';
import { Alert } from "./types";
import TimelineRawLog from "./TimelineRawLog";
import { Card } from "@/components/ui/card";
import AlertHeader from "./AlertDetailsSections/AlertHeader";
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

  return (
    <div className="h-full bg-[#1E1E2F] border-l border-[#7B68EE]/20">
      <AlertHeader onClose={onClose} />

      <div className="h-[calc(100%-4rem)] overflow-y-auto">
        <div className="p-4 space-y-4">
          <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
            <h3 className="text-lg font-semibold text-[#E0E0E0] mb-3">Alert Overview</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Title</h4>
                <p className="text-lg text-white">{alert.title || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Description</h4>
                <p className="text-sm text-[#E0E0E0]">{alert.description || 'N/A'}</p>
              </div>
            </div>
          </Card>

          <AlertTacticsSection tags={alert.tags} />
          <AlertMetadata alert={alert} browserTime={browserTime} />

          <Card className="bg-[#2B2B3B] border-[#7B68EE]/20">
            <TimelineRawLog alert={alert} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsView;