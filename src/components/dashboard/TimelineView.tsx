import { useInfiniteQuery } from "@tanstack/react-query";
import { X, Shield, Activity } from "lucide-react";
import { Alert } from "./types";
import TimelineEventCard from "./TimelineEventCard";
import InfiniteScrollLoader from "./InfiniteScrollLoader";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const EVENTS_PER_PAGE = 500;

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["timeline", entityType, entityId],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = entityType === "user" ? "user_impacted_timeline" : "computer_impacted_timeline";
      const queryParam = entityType === "user" ? "user_impacted" : "computer_name";
      
      const response = await fetch(
        `/api/${endpoint}?${queryParam}=${entityId}&page=${pageParam}&per_page=${EVENTS_PER_PAGE}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch timeline data: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        user_impacted_timeline: data.user_impacted_timeline || data.computer_impacted_timeline || [],
        pagination: {
          current_page: pageParam,
          per_page: EVENTS_PER_PAGE,
          has_more: (data.user_impacted_timeline || data.computer_impacted_timeline || []).length === EVENTS_PER_PAGE
        }
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.has_more) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    enabled: !!entityId,
  });

  const allEvents = data?.pages.flatMap(
    (page) => page.user_impacted_timeline
  ) || [];

  // Prepare data for the summary chart - group by severity
  const severityData = allEvents.reduce((acc: any[], event) => {
    const existingEntry = acc.find(item => item.severity === event.rule_level);
    if (existingEntry) {
      existingEntry.count += event.total_events;
    } else {
      acc.push({
        severity: event.rule_level || 'unknown',
        count: event.total_events || 0,
      });
    }
    return acc;
  }, []).sort((a, b) => b.count - a.count);

  if (inView && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return '#DC2626';
      case 'high': return '#F97316';
      case 'medium': return '#FB923C';
      case 'low': return '#22C55E';
      default: return '#64748B';
    }
  };

  return (
    <div className={`flex flex-col ${inSidebar ? 'h-full' : 'min-h-screen w-full bg-gradient-to-br from-[#1A1F2C] to-[#121212]'}`}>
      <div className="flex items-center justify-between p-8 border-b border-blue-500/10 bg-black/40">
        <div className="flex items-center gap-4">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              {entityId}
            </h2>
            <p className="text-lg text-blue-300/80 mt-2">Security Timeline Analysis</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <X className="h-6 w-6 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6 w-full">
            {/* Summary Chart */}
            <Card className="p-6 bg-black/40 border-blue-500/10">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-300">Event Severity Distribution</h3>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={severityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    barSize={40}
                  >
                    <XAxis 
                      dataKey="severity"
                      stroke="#475569"
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#475569"
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15,23,42,0.9)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                      formatter={(value: number) => [value.toLocaleString(), 'Events']}
                    />
                    <Bar 
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                    >
                      {severityData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={getSeverityColor(entry.severity)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Timeline Events */}
            {isLoading && allEvents.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : allEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No timeline events found</p>
              </div>
            ) : (
              <div className="relative space-y-6 w-full">
                {allEvents.map((event, index) => (
                  <TimelineEventCard
                    key={`${event.id}-${index}`}
                    event={event}
                    isLast={index === allEvents.length - 1}
                  />
                ))}
                
                <InfiniteScrollLoader
                  ref={ref}
                  hasMore={!!hasNextPage}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TimelineView;
