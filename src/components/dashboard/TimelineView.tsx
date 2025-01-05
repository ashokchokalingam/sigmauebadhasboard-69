import React, { useState } from "react";
import TimelineHeader from "./TimelineComponents/TimelineHeader";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { Card } from "@/components/ui/card";
import TimelineEventCard from "./TimelineEventCard";
import TimelineHistogram from "./TimelineHistogram/TimelineHistogram";

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d'>('24h');

  const { data: timelineData, isLoading } = useQuery({
    queryKey: ['timeline', entityType, entityId, timeframe],
    queryFn: async () => {
      let endpoint = '';
      
      // Select the correct endpoint based on entity type
      if (entityType === 'user') {
        endpoint = `http://172.16.0.75:5000/api/user_impacted_timeline?user_impacted=${entityId}`;
      } else if (entityType === 'computer') {
        endpoint = `http://172.16.0.75:5000/api/computer_impacted_timeline?computer_name=${entityId}`;
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }
      const data = await response.json();
      console.log('Timeline data:', data); // Debug log
      return data;
    },
    enabled: Boolean(entityType && entityId)
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
      ) : timelineData?.user_impacted_timeline && timelineData.user_impacted_timeline.length > 0 ? (
        <div className="space-y-8">
          <TimelineHistogram alerts={timelineData.user_impacted_timeline as Alert[]} />
          
          <div className="space-y-4 mt-8">
            {timelineData.user_impacted_timeline.map((event: any, index: number) => (
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