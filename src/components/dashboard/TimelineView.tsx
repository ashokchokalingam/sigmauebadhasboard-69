import React, { useState, useEffect } from "react";
import TimelineHeader from "./TimelineComponents/TimelineHeader";
import TimelineLoader from "./TimelineComponents/TimelineLoader";
import TimelineContent from "./TimelineComponents/TimelineContent";
import LoadMoreButton from "./TimelineComponents/LoadMoreButton";
import TimeRangeSelector from "./TimeRangeSelector";
import { useTimelineData } from "./hooks/useTimelineData";
import { useToast } from "@/hooks/use-toast";
import { Alert } from "./types";
import InfiniteScrollLoader from "./InfiniteScrollLoader";

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [timeframe, setTimeframe] = useState("24h");
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { toast } = useToast();

  const { alerts, isLoading, error, hasMore } = useTimelineData(entityType, entityId, page, timeframe);

  useEffect(() => {
    if (alerts) {
      if (page === 1) {
        console.log('Setting initial alerts:', alerts.length);
        setAllAlerts(alerts);
      } else {
        console.log('Adding new alerts:', alerts.length);
        setAllAlerts(prev => {
          const newAlerts = [...prev];
          alerts.forEach(alert => {
            if (!newAlerts.some(existing => existing.id === alert.id)) {
              newAlerts.push(alert);
            }
          });
          return newAlerts;
        });
      }
      setIsLoadingMore(false);
    }
  }, [alerts, page]);

  const toggleRawLog = (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    setPage(1);
    setAllAlerts([]);
    toast({
      title: "Loading new timeframe",
      description: `Fetching events for ${value} timeframe...`,
    });
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
      toast({
        title: "Loading more events",
        description: `Fetching batch ${page + 1} of timeline events...`,
      });
    }
  };

  if (error) {
    toast({
      title: "Error loading timeline",
      description: "Failed to load timeline data. Please try again.",
      variant: "destructive",
    });
  }

  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <TimelineHeader 
          entityType={entityType} 
          entityId={entityId} 
          onClose={onClose} 
          inSidebar={inSidebar} 
        />
        <TimeRangeSelector
          value={timeframe}
          onChange={handleTimeframeChange}
        />
      </div>

      {isLoading && page === 1 ? (
        <TimelineLoader />
      ) : allAlerts.length === 0 ? (
        <div className="text-center text-purple-400/60 py-8">
          No events found for this {entityType}
        </div>
      ) : (
        <>
          <TimelineContent
            alerts={allAlerts}
            expandedAlert={expandedAlert}
            selectedEventType={selectedEventType}
            onEventTypeSelect={setSelectedEventType}
            onToggleRaw={toggleRawLog}
          />
          
          <InfiniteScrollLoader ref={null} hasMore={hasMore} />
          
          {(isLoading || isLoadingMore) && page > 1 && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          )}

          {hasMore && !isLoading && !isLoadingMore && (
            <LoadMoreButton 
              show={true}
              onLoadMore={handleLoadMore}
            />
          )}
        </>
      )}
    </>
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