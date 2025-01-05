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
        <div className="relative space-y-0">
          <div className="absolute left-6 top-[60px] bottom-0 w-0.5 bg-green-500/30" />
          {summary.map((event, index) => (
            <div key={index} className="relative pb-6">
              <div className="absolute left-5 top-[30px] w-3 h-3 rounded-full bg-green-500" />
              <TimelineEventCard event={event} />
            </div>
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