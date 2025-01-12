import { format } from "date-fns";
import { Shield, Clock } from "lucide-react";
import { Alert } from "./types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  onToggleRaw?: (id: string, event: React.MouseEvent) => void;
  showRaw?: boolean;
  entityType: "user" | "computer";
}

const TimelineEventCard = ({
  event,
  isLast = false,
  onToggleRaw,
  showRaw = false,
  entityType,
}: TimelineEventCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm:ss a");
    } catch (e) {
      return dateString;
    }
  };

  const getSeverityColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-blue-400";
    }
  };

  const severityColor = getSeverityColor(event.rule_level);

  return (
    <div className="group relative pl-4 w-full">
      {/* Timeline dot */}
      <div className="absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2 border-green-400 bg-background" />
      
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-0 top-8 -ml-[1px] h-[calc(100%+2rem)] w-[2px] bg-green-400/20" />
      )}

      <div className="relative ml-4 mb-8 w-full">
        <Card className="w-full bg-black/40 border-slate-700/50">
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className={`h-5 w-5 ${severityColor}`} />
                <h3 className="text-lg font-semibold text-white">{event.title}</h3>
              </div>
              <Badge variant="outline" className={`${severityColor} border-current`}>
                {event.rule_level || "Info"} • {event.total_events || 1} events
              </Badge>
            </div>

            <p className="text-slate-300 mb-4">{event.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              {event.first_time_seen && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>First: {formatDate(event.first_time_seen)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>First time seen</TooltipContent>
                </Tooltip>
              )}

              {event.last_time_seen && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>Last: {formatDate(event.last_time_seen)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Last time seen</TooltipContent>
                </Tooltip>
              )}
            </div>

            {onToggleRaw && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => onToggleRaw(event.id, e)}
                  className="text-blue-400 border-blue-400/20 hover:bg-blue-400/10"
                >
                  {showRaw ? "Hide Raw Data" : "Show Raw Data"}
                </Button>
              </div>
            )}

            {showRaw && (
              <div className="mt-4 p-4 bg-black/40 rounded-lg">
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  {typeof event.raw === "string"
                    ? event.raw
                    : JSON.stringify(event.raw, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TimelineEventCard;