import { Activity } from "lucide-react";
import { EventSummary } from "./types";
import TimelineEventCard from "./TimelineEventCard";
import { ScrollArea } from "../ui/scroll-area";

interface TimelineEventSummaryProps {
  summary: EventSummary[];
  isLoading: boolean;
}

const TimelineEventSummary = ({ summary, isLoading }: TimelineEventSummaryProps) => {
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
      <div className="flex items-center gap-2 text-lg font-semibold text-blue-100">
        <Activity className="h-5 w-5 text-blue-400" />
        Event Timeline
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-[26px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500/50 to-purple-500/50" />
          
          <div className="space-y-6">
            {summary.map((event, index) => (
              <TimelineEventCard 
                key={index} 
                event={event} 
                isLast={index === summary.length - 1}
              />
            ))}
            
            {summary.length === 0 && (
              <div className="text-center text-blue-300/70 py-8">
                No events found for this time period
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineEventSummary;