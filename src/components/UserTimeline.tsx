import React from "react";
import { Activity, AlertTriangle, Shield, Skull } from "lucide-react";

interface TimelineEvent {
  time: string;
  event: string;
  severity: "critical" | "high" | "medium";
  tactic: string;
}

interface UserTimelineProps {
  username: string;
  events: TimelineEvent[];
}

const UserTimeline = ({ username, events }: UserTimelineProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Skull className="h-5 w-5 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "medium":
        return <Shield className="h-5 w-5 text-yellow-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Activity Timeline for {username}
      </h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="relative flex gap-4 pb-8 last:pb-0 before:absolute before:left-[17px] before:top-[30px] before:h-full before:w-[2px] before:bg-red-900/30 last:before:hidden"
          >
            <div className="z-10 flex h-9 w-9 items-center justify-center rounded-full bg-red-950/50 border border-red-900/50">
              {getSeverityIcon(event.severity)}
            </div>
            <div className="flex-1 bg-red-950/20 rounded-lg border border-red-900/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-200 font-mono text-sm">{event.time}</span>
                <span className="px-2 py-1 bg-red-500/20 rounded text-xs text-red-200 border border-red-500/30">
                  {event.tactic}
                </span>
              </div>
              <p className="text-red-100">{event.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTimeline;