
import { useInfiniteQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import TimelineSummaryStats from "./TimelineComponents/TimelineSummaryStats";
import TimelineHeader from "../timeline/TimelineHeader";
import TimelineContent from "../timeline/TimelineContent";
import { formatTimelineData, getTimelineEndpoint } from "@/utils/timelineHelpers";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EVENTS_PER_PAGE = 50;

interface TimelineViewProps {
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const { ref, inView } = useInView();
  const [ipFilter, setIpFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [computerFilter, setComputerFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["timeline", entityType, entityId, activeTab],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = getTimelineEndpoint(entityType);
      const queryParam = entityType === 'userorigin' ? 'user_origin' : 
                        entityType === 'userimpacted' ? 'user_impacted' : 
                        'computer_name';
      
      console.log('Fetching timeline data:', {
        endpoint,
        queryParam,
        entityId,
        entityType,
        pageParam,
        activeTab
      });
      
      const response = await fetch(`${endpoint}?${queryParam}=${encodeURIComponent(entityId)}&page=${pageParam}&per_page=${EVENTS_PER_PAGE}&type=${activeTab}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }

      const data = await response.json();
      return formatTimelineData(data);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.has_more) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    enabled: Boolean(entityType && entityId),
  });

  const allEvents = data?.pages.flatMap(
    (page) => entityType === "computersimpacted" ? page.computer_impacted_timeline : 
              entityType === "userorigin" ? page.user_origin_timeline :
              page.user_impacted_timeline
  ) || [];

  const filteredEvents = allEvents.filter(event => {
    const matchesIp = !ipFilter || (event.ip_address && event.ip_address.toLowerCase().includes(ipFilter.toLowerCase()));
    const matchesUser = !userFilter || 
      (event.user_id && event.user_id.toLowerCase().includes(userFilter.toLowerCase())) ||
      (event.target_user_name && event.target_user_name.toLowerCase().includes(userFilter.toLowerCase()));
    const matchesComputer = !computerFilter || 
      (event.computer_name && event.computer_name.toLowerCase().includes(computerFilter.toLowerCase()));
    
    return matchesIp && matchesUser && matchesComputer;
  });

  if (inView && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }

  return (
    <div className="flex flex-col h-screen bg-[#1A1F2C]">
      <TimelineHeader entityId={entityId} onClose={onClose} />

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col space-y-4 p-6">
          <div className="flex-none">
            <TimelineSummaryStats alerts={filteredEvents} />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
              <Input
                placeholder="Filter by IP..."
                value={ipFilter}
                onChange={(e) => setIpFilter(e.target.value)}
                className="pl-9 bg-black/20 border-blue-500/20"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
              <Input
                placeholder="Filter by Username..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="pl-9 bg-black/20 border-blue-500/20"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
              <Input
                placeholder="Filter by Computer..."
                value={computerFilter}
                onChange={(e) => setComputerFilter(e.target.value)}
                className="pl-9 bg-black/20 border-blue-500/20"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-black/20 border border-blue-500/20">
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies Only</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 min-h-0">
              <div className="flex-1 min-h-0 bg-black/40 rounded-xl border border-blue-500/10">
                <TimelineContent
                  allEvents={filteredEvents}
                  entityType={entityType}
                  isLoading={isLoading}
                  hasNextPage={!!hasNextPage}
                  loaderRef={ref}
                />
              </div>
            </TabsContent>

            <TabsContent value="anomalies" className="flex-1 min-h-0">
              <div className="flex-1 min-h-0 bg-black/40 rounded-xl border border-blue-500/10">
                <TimelineContent
                  allEvents={filteredEvents.filter(event => event.ml_cluster !== null)}
                  entityType={entityType}
                  isLoading={isLoading}
                  hasNextPage={!!hasNextPage}
                  loaderRef={ref}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
