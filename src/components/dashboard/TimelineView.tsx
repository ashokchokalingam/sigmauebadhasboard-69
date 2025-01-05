import React from "react";
import TimelineHeader from "./TimelineComponents/TimelineHeader";
import { useQuery } from "@tanstack/react-query";
import TimelineGraph from "./TimelineGraph";
import { Alert } from "./types";
import { Card } from "@/components/ui/card";
import TimelineEventCard from "./TimelineEventCard";

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const { data: timelineData, isLoading } = useQuery({
    queryKey: ['timeline', entityType, entityId],
    queryFn: async () => {
      const response = await fetch(`/api/user_impacted_timeline?user_impacted=${entityId}`);
      if (!response.ok) throw new Error('Failed to fetch timeline data');
      const data = await response.json();
      return data.user_impacted_timeline;
    }
  });

  const content = (
    <div className="space-y-8">
      <TimelineHeader 
        entityType={entityType} 
        entityId={entityId} 
        onClose={onClose} 
        inSidebar={inSidebar}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : timelineData && timelineData.length > 0 ? (
        <div className="space-y-8">
          <TimelineGraph alerts={timelineData as unknown as Alert[]} />
          
          <div className="space-y-4 mt-8">
            {timelineData.map((event: any, index: number) => (
              <TimelineEventCard key={index} event={event} />
            ))}
          </div>
        </div>
      ) : (
        <Card className="bg-black/40 border-blue-500/10 p-8">
          <div className="text-center text-blue-300/70">
            No timeline events found for this entity
          </div>
        </Card>
      )}
    </div>
  );

  if (inSidebar) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-[#1A1F2C] overflow-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        {content}
      </div>
    </div>
  );
};

export default TimelineView;