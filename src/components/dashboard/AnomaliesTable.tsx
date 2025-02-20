
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import { defaultColumns } from "./TableConfig";
import { useAlertsFilter } from "./hooks/useAlertsFilter";
import AnomaliesTableView from "./AnomaliesTableView";
import AnomaliesTableHeaderSection from "./AnomaliesTableHeaderSection";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useToast } from "@/components/ui/use-toast";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

interface LogsResponse {
  alerts: Alert[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_records: number;
  };
  total_count: number;
}

const AnomaliesTable = ({ alerts: outlierAlerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    defaultColumns.map((col) => col.key)
  );
  const [dataSource, setDataSource] = useState<'mloutliers' | 'anomalies'>('mloutliers');
  const { toast } = useToast();
  const { ref, inView } = useInView();

  const {
    data: logsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingLogs,
  } = useInfiniteQuery<LogsResponse>({
    queryKey: ['alerts', dataSource],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/alerts?page=${pageParam}&per_page=50`);
      if (!response.ok) throw new Error('Failed to fetch anomalies');
      const data = await response.json();
      return data;
    },
    initialPageParam: 1,
    enabled: dataSource === 'anomalies',
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.pagination.current_page < lastPage.pagination.total_pages;
      return hasMore ? lastPage.pagination.current_page + 1 : undefined;
    },
    meta: {
      onSettled: (data, error) => {
        if (error) {
          toast({
            title: "Error fetching anomalies",
            description: "Failed to load anomaly data. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  });

  const allLogs = logsData?.pages.flatMap(page => page.alerts) || [];
  const { filters, filteredAlerts, handleFilterChange } = useAlertsFilter(
    dataSource === 'mloutliers' ? outlierAlerts : allLogs
  );

  const handleColumnToggle = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  const handleSelectAll = () => {
    const allColumnKeys = defaultColumns.map(col => col.key);
    setVisibleColumns(allColumnKeys);
  };

  const handleDeselectAll = () => {
    setVisibleColumns(['system_time']);
  };

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    console.log("Timeline view requested for:", type, id);
  };

  const handleDataSourceChange = (source: 'mloutliers' | 'anomalies') => {
    setDataSource(source);
    setSelectedAlert(null);
  };

  // Handle infinite scroll
  if (inView && !isFetchingNextPage && hasNextPage && dataSource === 'anomalies') {
    fetchNextPage();
  }

  return (
    <Card className="relative border-blue-500/10">
      <AnomaliesTableHeaderSection
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        dataSource={dataSource}
        onDataSourceChange={handleDataSourceChange}
      />
      <CardContent className="p-0">
        <AnomaliesTableView
          alerts={filteredAlerts}
          selectedAlert={selectedAlert}
          onFilterChange={handleFilterChange}
          filters={filters}
          visibleColumns={visibleColumns}
          onAlertSelect={setSelectedAlert}
          onTimelineView={handleTimelineView}
          filteredAlerts={filteredAlerts}
          onClose={() => setSelectedAlert(null)}
        />
        {dataSource === 'anomalies' && (
          <div
            ref={ref}
            className="w-full h-20 flex items-center justify-center"
          >
            {isFetchingNextPage && (
              <div className="text-sm text-blue-400">Loading more anomalies...</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomaliesTable;
