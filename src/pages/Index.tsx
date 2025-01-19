import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Alert } from "@/components/dashboard/types";
import { useQuery } from "@tanstack/react-query";
import TimeFrameSelector from "@/components/TimeFrameSelector";

const INITIAL_BATCH_SIZE = 100;
const TOTAL_BATCH_SIZE = 1000;

interface AlertsResponse {
  alerts: Alert[];
  total_count: number;
}

const useAlertsFetching = (timeFrame: string, currentPage: number) => {
  const { toast } = useToast();

  const fetchAlerts = async (batchSize: number, page: number): Promise<AlertsResponse> => {
    try {
      console.log('Fetching alerts:', { batchSize, page, timeFrame });
      const response = await fetch(`/api/alerts?page=${page}&per_page=${batchSize}&timeframe=${timeFrame}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received alerts data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error fetching data",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Initial alerts query
  const initialQuery = useQuery({
    queryKey: ['initial-alerts', timeFrame],
    queryFn: () => fetchAlerts(INITIAL_BATCH_SIZE, 1),
    refetchInterval: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Initial query error:', error);
        }
      }
    }
  });

  // Remaining alerts query
  const remainingQuery = useQuery({
    queryKey: ['remaining-alerts', currentPage, timeFrame],
    queryFn: () => fetchAlerts(TOTAL_BATCH_SIZE - INITIAL_BATCH_SIZE, 2),
    enabled: !!initialQuery.data?.alerts?.length && initialQuery.data.alerts.length < TOTAL_BATCH_SIZE,
    refetchInterval: 5 * 60 * 1000,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Remaining query error:', error);
        }
      }
    }
  });

  return {
    initialQuery,
    remainingQuery,
    toast
  };
};

const Index = () => {
  const [selectedEntity, setSelectedEntity] = useState<{ type: "userorigin" | "userimpacted" | "computersimpacted"; id: string } | null>(null);
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>([]);
  const [currentTotalRecords, setCurrentTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFrame, setTimeFrame] = useState("1d");
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);

  const { initialQuery, remainingQuery, toast } = useAlertsFetching(timeFrame, currentPage);

  useEffect(() => {
    console.log('Initial query state:', {
      isLoading: initialQuery.isLoading,
      isError: initialQuery.isError,
      data: initialQuery.data
    });

    if (initialQuery.data) {
      setCurrentAlerts(initialQuery.data.alerts || []);
      setAllAlerts(initialQuery.data.alerts || []);
      setCurrentTotalRecords(initialQuery.data.total_count || 0);
    }
  }, [initialQuery.data]);

  useEffect(() => {
    console.log('Remaining query state:', {
      isLoading: remainingQuery.isLoading,
      isError: remainingQuery.isError,
      data: remainingQuery.data
    });

    if (remainingQuery.data?.alerts) {
      setCurrentAlerts(prev => [...prev, ...remainingQuery.data.alerts]);
      setAllAlerts(prev => [...prev, ...remainingQuery.data.alerts]);
    }
  }, [remainingQuery.data]);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleEntitySelect = (entity: { type: "userorigin" | "userimpacted" | "computersimpacted"; id: string } | null) => {
    setSelectedEntity(entity);
  };

  if (initialQuery.isError || remainingQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1f2c] p-4">
        <div className="text-red-500 text-xl mb-4">Error loading dashboard data</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (initialQuery.isLoading && currentAlerts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1f2c]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2c]">
      <div className="p-6">
        <TimeFrameSelector value={timeFrame} onValueChange={setTimeFrame} />
      </div>
      <DashboardLayout
        alerts={currentAlerts}
        allAlerts={allAlerts}
        totalRecords={currentTotalRecords}
        isLoading={initialQuery.isLoading || remainingQuery.isLoading}
        onEntitySelect={handleEntitySelect}
        selectedEntity={selectedEntity}
        onLoadMore={handleLoadMore}
        hasMore={currentAlerts.length < TOTAL_BATCH_SIZE}
      />
      
      {(initialQuery.isLoading || remainingQuery.isLoading) && currentAlerts.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Loading data... ({currentAlerts.length} / {TOTAL_BATCH_SIZE})
        </div>
      )}
    </div>
  );
};

export default Index;