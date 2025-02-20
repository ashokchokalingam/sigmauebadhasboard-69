
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
    <div className="h-full flex flex-col bg-[#1E1E2F]">
      <AlertHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
        <div className="p-6 space-y-6">
          <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-6">
            <h3 className="text-xl font-semibold text-[#E0E0E0] mb-4">Alert Overview</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9] mb-1">Title</h4>
                <p className="text-xl text-white font-medium">{alert.title || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9] mb-1">Description</h4>
                <p className="text-base text-[#E0E0E0] leading-relaxed">{alert.description || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9] mb-1">Risk Score</h4>
                  <p className={`text-2xl font-semibold ${getRiskColor(alert.risk)}`}>
                    {alert.risk === null ? 'N/A' : `${alert.risk}%`}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9] mb-1">ML Cluster</h4>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-400" />
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20 font-medium">
                      {alert.ml_cluster !== undefined && alert.ml_cluster !== null ? `${alert.ml_cluster}` : 'No Cluster'}
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
                  <p className="text-base text-[#E0E0E0] leading-relaxed">
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
                <Shield className="h-5 w-5 text-[#7B68EE]" />
                <p className="text-sm text-[#E0E0E0] font-mono">
                  {alert.ruleid || 'N/A'}
                </p>
              </div>
            </Card>

            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
              <h4 className="text-sm font-medium text-[#A9A9A9] mb-2">Severity</h4>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#7B68EE]" />
                <p className="text-sm text-[#E0E0E0] capitalize font-medium">
                  {alert.rule_level || 'N/A'}
                </p>
              </div>
            </Card>

            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
              <h4 className="text-sm font-medium text-[#A9A9A9] mb-2">Task</h4>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#7B68EE]" />
                <p className="text-sm text-[#E0E0E0]">
                  {alert.task || 'N/A'}
                </p>
              </div>
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
