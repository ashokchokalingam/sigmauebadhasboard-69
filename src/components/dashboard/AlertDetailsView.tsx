import { Alert } from "./types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Clock, Server, User, Hash, Activity, ChevronDown, ChevronUp } from "lucide-react";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineRawLog from "./TimelineRawLog";
import AlertDetailsHeader from "./AlertDetailsHeader";
import { useState, useEffect } from "react";

interface AlertDetailsViewProps {
  alert: Alert;
}

const AlertDetailsView = ({ alert }: AlertDetailsViewProps) => {
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isRawExpanded) {
        setIsRawExpanded(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isRawExpanded]);

  return (
    <div className="space-y-6">
      <AlertDetailsHeader alert={alert} />
      
      <Card className="bg-black/40 border-blue-500/10">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-blue-100 mb-6 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-blue-500" />
            Event Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-blue-400 mb-2">Event Time</p>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <p className="text-base text-blue-100">
                  {new Date(alert.system_time || '').toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400 mb-2">User ID</p>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <p className="text-base text-blue-100">{alert.user_id || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400 mb-2">Computer Name</p>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-500" />
                <p className="text-base text-blue-100">{alert.computer_name || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400 mb-2">Event ID</p>
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-500" />
                <p className="text-base text-blue-100">{alert.event_id || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400 mb-2">Provider Name</p>
              <p className="text-base text-blue-100">{alert.provider_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400 mb-2">Task</p>
              <p className="text-base text-blue-100">{alert.task || 'N/A'}</p>
            </div>
            {alert.ip_address && (
              <div>
                <p className="text-sm font-medium text-blue-400 mb-2">IP Address</p>
                <p className="text-base text-blue-100">{alert.ip_address}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <TimelineMitreSection alert={alert} />
      
      {alert.raw && (
        <Card className="bg-black/40 border-blue-500/10">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-500/5 transition-colors"
            onClick={() => setIsRawExpanded(!isRawExpanded)}
          >
            <h3 className="text-xl font-semibold text-blue-100 flex items-center gap-2">
              Raw Log Data
            </h3>
            {isRawExpanded ? (
              <ChevronUp className="h-6 w-6 text-blue-400" />
            ) : (
              <ChevronDown className="h-6 w-6 text-blue-400" />
            )}
          </div>
          {isRawExpanded && (
            <ScrollArea className="h-[400px] w-full">
              <div className="p-4">
                <TimelineRawLog alert={alert} />
              </div>
            </ScrollArea>
          )}
        </Card>
      )}
    </div>
  );
};

export default AlertDetailsView;