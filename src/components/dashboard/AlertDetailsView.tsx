import { Alert } from "./types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Clock, Server, User, Shield, Hash, Activity } from "lucide-react";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineRawLog from "./TimelineRawLog";
import AlertDetailsHeader from "./AlertDetailsHeader";

interface AlertDetailsViewProps {
  alert: Alert;
}

const AlertDetailsView = ({ alert }: AlertDetailsViewProps) => {
  // Parse raw JSON data if available
  const rawData = alert.raw_log ? JSON.parse(alert.raw_log) : null;

  return (
    <div className="space-y-6">
      <AlertDetailsHeader alert={alert} />
      
      <Card className="bg-black/40 border-blue-500/10">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-blue-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            Event Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-medium text-blue-400">Event Time</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-blue-100">
                  {new Date(alert.system_time).toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">User</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-blue-100">{rawData?.TargetUserName || alert.user_id || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Computer</p>
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-blue-100">{alert.computer_name}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Event ID</p>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-blue-100">{alert.event_id}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Rule ID</p>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-blue-100">{rawData?.id || alert.rule_id || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Rule Level</p>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-blue-100 capitalize">{rawData?.rule_level || alert.rule_level || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Process Name</p>
              <p className="text-sm text-blue-100">{rawData?.ProcessName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Process ID</p>
              <p className="text-sm text-blue-100">{rawData?.ProcessID || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">IP Address</p>
              <p className="text-sm text-blue-100">{rawData?.IpAddress || alert.ip_address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Provider Name</p>
              <p className="text-sm text-blue-100">{alert.provider_name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Task</p>
              <p className="text-sm text-blue-100">{rawData?.Task || alert.task_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Channel</p>
              <p className="text-sm text-blue-100">{rawData?.Channel || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Authentication Package</p>
              <p className="text-sm text-blue-100">{rawData?.AuthenticationPackageName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Logon Type</p>
              <p className="text-sm text-blue-100">{rawData?.LogonType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Status</p>
              <p className="text-sm text-blue-100">{rawData?.Status || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400">Failure Reason</p>
              <p className="text-sm text-blue-100">{rawData?.FailureReason || 'N/A'}</p>
            </div>
          </div>
        </div>
      </Card>

      <TimelineMitreSection alert={alert} />
      
      <Card className="bg-black/40 border-blue-500/10">
        <ScrollArea className="h-[400px]">
          <TimelineRawLog alert={alert} />
        </ScrollArea>
      </Card>
    </div>
  );
};

export default AlertDetailsView;