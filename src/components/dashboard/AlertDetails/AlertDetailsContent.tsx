import React from 'react';
import { Alert } from "../types";
import { Card } from "@/components/ui/card";
import AlertIdentification from "../AlertDetailsSections/AlertIdentification";
import MitreInfo from "../AlertDetailsSections/MitreInfo";
import SystemInfo from "../AlertDetailsSections/SystemInfo";
import TimelineRawLog from "../TimelineRawLog";

interface AlertDetailsContentProps {
  alert: Alert;
  browserTime: string;
}

const AlertDetailsContent = ({ alert, browserTime }: AlertDetailsContentProps) => {
  return (
    <div className="p-4 space-y-4">
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
            <h4 className="text-sm font-medium text-[#A9A9A9]">User Origin</h4>
            <p className="text-sm text-[#E0E0E0] font-mono">{alert.user_id || 'N/A'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#A9A9A9]">User Impacted</h4>
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
  );
};

export default AlertDetailsContent;