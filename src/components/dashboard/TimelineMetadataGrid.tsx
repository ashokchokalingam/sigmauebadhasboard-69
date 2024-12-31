import { Monitor, User } from "lucide-react";
import { Alert } from "./types";

interface TimelineMetadataGridProps {
  alert: Alert;
}

const TimelineMetadataGrid = ({ alert }: TimelineMetadataGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm font-medium text-blue-400">Computer</p>
        <p className="text-base text-blue-100 font-mono flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          {alert.computer_name || 'N/A'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-blue-400">User ID</p>
        <p className="text-base text-blue-100 font-mono flex items-center gap-2">
          <User className="h-4 w-4" />
          {alert.user_id || 'N/A'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-blue-400">Event ID</p>
        <p className="text-base text-blue-100 font-mono">{alert.event_id || 'N/A'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-blue-400">Provider</p>
        <p className="text-base text-blue-100">{alert.provider_name || 'N/A'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-blue-400">Rule ID</p>
        <p className="text-base text-blue-100 font-mono">{alert.ruleid || 'N/A'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-blue-400">Rule Level</p>
        <p className="text-base text-blue-100">{alert.rule_level || 'N/A'}</p>
      </div>
      {alert.ip_address && (
        <div>
          <p className="text-sm font-medium text-blue-400">IP Address</p>
          <p className="text-base text-blue-100 font-mono">{alert.ip_address}</p>
        </div>
      )}
      {alert.task && (
        <div>
          <p className="text-sm font-medium text-blue-400">Task</p>
          <p className="text-base text-blue-100">{alert.task}</p>
        </div>
      )}
    </div>
  );
};

export default TimelineMetadataGrid;