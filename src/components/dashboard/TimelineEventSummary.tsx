import { Activity } from "lucide-react";
import { EventSummary } from "./types";
import TimelineEventCard from "./TimelineEventCard";
import { ScrollArea } from "../ui/scroll-area";

interface TimelineEventSummaryProps {
  summary: EventSummary[];
  isLoading: boolean;
  entityType: "user" | "computer";
}

const TimelineEventSummary = ({ summary, isLoading, entityType }: TimelineEventSummaryProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-blue-950/50 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-blue-100 mb-6">
        <Activity className="h-5 w-5 text-blue-400" />
        Event Timeline
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        <div className="relative max-w-3xl mx-auto">
          {summary.map((event, index) => (
            <TimelineEventCard 
              key={index} 
              event={event} 
              isLast={index === summary.length - 1}
              entityType={entityType}
            />
          ))}
          
          {summary.length === 0 && (
            <div className="text-center text-blue-300/70 py-8">
              No events found for this time period
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineEventSummary;