import { format } from "date-fns";
import { Shield, AlertTriangle } from "lucide-react";
import { Card } from "../ui/card";

interface TimelineEventCardProps {
  event: {
    title: string;
    tags?: string;
    description?: string;
    rule_level?: string;
    first_time_seen?: string;
    last_time_seen?: string;
    total_events?: number;
  };
  isLast: boolean;
  entityType: "user" | "computer" | "origin";
}

const TimelineEventCard = ({ event, isLast, entityType }: TimelineEventCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy HH:mm:ss");
    } catch (e) {
      return dateString;
    }
  };

  const getSeverityColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="relative">
      {!isLast && (
        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-blue-500/20" />
      )}
      
      <Card className="relative z-10 bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-100">{event.title}</h3>
                {event.description && (
                  <p className="mt-2 text-blue-300/80">{event.description}</p>
                )}
              </div>

              {event.tags && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-blue-400/60">First Seen</p>
                  <p className="text-sm text-blue-200">{formatDate(event.first_time_seen)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-400/60">Last Seen</p>
                  <p className="text-sm text-blue-200">{formatDate(event.last_time_seen)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-400/60">Total Events</p>
                  <p className="text-sm text-blue-200">{event.total_events || 0}</p>
                </div>
              </div>

              {event.rule_level && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${getSeverityColor(event.rule_level)}`} />
                  <span className={`text-sm font-medium ${getSeverityColor(event.rule_level)}`}>
                    {event.rule_level}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TimelineEventCard;