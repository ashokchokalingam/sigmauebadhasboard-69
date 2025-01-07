import { useInfiniteQuery } from "@tanstack/react-query";
import { X, Shield } from "lucide-react";
import { Alert } from "./types";
import TimelineEventCard from "./TimelineEventCard";
import InfiniteScrollLoader from "./InfiniteScrollLoader";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "../ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from "react";

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
      console.log("Fetching timeline data:", { entityType, entityId, pageParam });
      const endpoint = entityType === "user" ? "user_impacted_timeline" : "computer_impacted_timeline";
      const queryParam = entityType === "user" ? "user_impacted" : "computer_name";
      
      const response = await fetch(
        `/api/${endpoint}?${queryParam}=${entityId}&page=${pageParam}&per_page=${EVENTS_PER_PAGE}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch timeline data: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Timeline data received:", data);
      
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

  const chartData = useMemo(() => {
    if (!allEvents.length) return [];
    
    const timeGroups: { [key: string]: { time: string; count: number } } = {};
    
    allEvents.forEach((event) => {
      const date = new Date(event.system_time);
      const timeKey = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = {
          time: timeKey,
          count: 0
        };
      }
      timeGroups[timeKey].count++;
    });

    return Object.values(timeGroups).sort((a, b) => 
      new Date('1970/01/01 ' + a.time).getTime() - new Date('1970/01/01 ' + b.time).getTime()
    );
  }, [allEvents]);

  if (inView && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }

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

      <div className="p-6 bg-black/40">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9b87f5" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#9b87f5" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="time"
                stroke="#8E9196"
                tick={{ fill: '#C8C8C9', fontSize: 11 }}
              />
              <YAxis
                stroke="#8E9196"
                tick={{ fill: '#C8C8C9', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(26, 31, 44, 0.9)',
                  border: '1px solid rgba(155, 135, 245, 0.1)',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Bar
                dataKey="count"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6 w-full">
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