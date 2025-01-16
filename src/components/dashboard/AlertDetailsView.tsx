import React from 'react';
import { Alert } from "./types";
import TimelineRawLog from "./TimelineRawLog";
import { Card } from "@/components/ui/card";
import AlertHeader from "./AlertDetailsSections/AlertHeader";
import AlertTacticsSection from "./AlertDetailsSections/AlertTacticsSection";
import AlertMetadata from "./AlertDetailsSections/AlertMetadata";
import { Shield, AlertTriangle, Activity, User, Monitor, Brain } from "lucide-react";

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

  const getRiskColor = (risk: number | null) => {
    if (risk === null) return "text-gray-400";
    if (risk >= 80) return "text-red-400";
    if (risk >= 60) return "text-orange-400";
    if (risk >= 40) return "text-yellow-400";
    return "text-green-400";
  };

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Risk Score</h4>
                  <p className={`text-lg font-medium ${getRiskColor(alert.risk)}`}>
                    {alert.risk === null ? 'N/A' : `${alert.risk}%`}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">ML Cluster</h4>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-400" />
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20">
                      {alert.ml_cluster === null ? 'N/A' : `Cluster ${alert.ml_cluster}`}
                    </span>
                  </div>
                </div>
              </div>
              {alert.ml_description && (
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4" />
                    ML Analysis
                  </h4>
                  <p className="text-sm text-[#E0E0E0] leading-relaxed">
                    {alert.ml_description}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
              <h4 className="text-sm font-medium text-[#A9A9A9] mb-2">Rule ID</h4>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#7B68EE]" />
                <p className="text-sm text-[#E0E0E0] font-mono">
                  {alert.ruleid || 'N/A'}
                </p>
              </div>
            </Card>

            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
              <h4 className="text-sm font-medium text-[#A9A9A9] mb-2">Severity</h4>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#7B68EE]" />
                <p className="text-sm text-[#E0E0E0] capitalize">
                  {alert.rule_level || 'N/A'}
                </p>
              </div>
            </Card>

            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
              <h4 className="text-sm font-medium text-[#A9A9A9] mb-2">Task</h4>
              <p className="text-sm text-[#E0E0E0]">
                {alert.task || 'N/A'}
              </p>
            </Card>
          </div>

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