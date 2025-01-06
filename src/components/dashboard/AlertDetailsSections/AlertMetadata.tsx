import { Card } from "@/components/ui/card";
import { Alert } from "../types";
import { getSeverityColor } from "../utils";

interface AlertMetadataProps {
  alert: Alert;
  browserTime: string;
}

const AlertMetadata = ({ alert, browserTime }: AlertMetadataProps) => {
  return (
    <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
      <h3 className="text-lg font-semibold text-[#E0E0E0] mb-3">Event Details</h3>
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
          <h4 className="text-sm font-medium text-[#A9A9A9]">Severity</h4>
          <p className={`text-sm font-mono ${getSeverityColor(alert.rule_level || '')}`}>
            {alert.rule_level || 'N/A'}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">ML Cluster</h4>
          <p className="text-sm text-[#E0E0E0] font-mono">{alert.dbscan_cluster || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">System Time</h4>
          <p className="text-sm text-[#E0E0E0] font-mono">{browserTime}</p>
        </div>
      </div>
    </Card>
  );
};

export default AlertMetadata;