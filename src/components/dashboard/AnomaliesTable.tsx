
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import { defaultColumns } from "./TableConfig";
import { useAlertsFilter } from "./hooks/useAlertsFilter";
import AnomaliesTableView from "./AnomaliesTableView";
import AnomaliesTableHeaderSection from "./AnomaliesTableHeaderSection";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useToast } from "@/components/ui/use-toast";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts: outlierAlerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    defaultColumns.map((col) => col.key)
  );
  const [dataSource, setDataSource] = useState<'outliers' | 'logs'>('outliers');
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const { ref, inView } = useInView();

  const {
    data: logsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingLogs,
  } = useQuery({
    queryKey: ['alerts', dataSource],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/alerts?page=${pageParam}&per_page=50`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json();
    },
    enabled: dataSource === 'logs',
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    meta: {
      onSettled: (data, error) => {
        if (error) {
          toast({
            title: "Error fetching logs",
            description: "Failed to load log data. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  });

  const { filters, filteredAlerts, handleFilterChange } = useAlertsFilter(
    dataSource === 'outliers' ? outlierAlerts : (logsData?.pages?.flatMap(page => page.alerts) || [])
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

  const handleDataSourceChange = (source: 'outliers' | 'logs') => {
    setDataSource(source);
    setSelectedAlert(null);
    setPage(1);
  };

  // Handle infinite scroll
  if (inView && !isFetchingNextPage && hasNextPage && dataSource === 'logs') {
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
        {dataSource === 'logs' && (
          <div
            ref={ref}
            className="w-full h-20 flex items-center justify-center"
          >
            {isFetchingNextPage && (
              <div className="text-sm text-blue-400">Loading more logs...</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomaliesTable;
