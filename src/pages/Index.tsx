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

const Index = () => {
  const { toast } = useToast();
  const [timeFrame, setTimeFrame] = useState("1d");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntity, setSelectedEntity] = useState<{ type: "userorigin" | "userimpacted" | "computersimpacted"; id: string } | null>(null);
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>([]);
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);

  const fetchAlerts = async (batchSize: number, page: number): Promise<AlertsResponse> => {
    console.log('Fetching alerts:', { batchSize, page, timeFrame });
    
    const response = await fetch(`/api/alerts?page=${page}&per_page=${batchSize}&timeframe=${timeFrame}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      credentials: 'same-origin'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received alerts data:', data);
    
    return {
      alerts: data.alerts || [],
      total_count: data.total_count || 0
    };
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
          toast({
            title: "Error fetching data",
            description: error instanceof Error ? error.message : "An unexpected error occurred",
            variant: "destructive",
          });
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
          toast({
            title: "Error fetching additional data",
            description: error instanceof Error ? error.message : "An unexpected error occurred",
            variant: "destructive",
          });
        }
      }
    }
  });

  useEffect(() => {
    if (initialQuery.data) {
      setCurrentAlerts(initialQuery.data.alerts || []);
      setAllAlerts(initialQuery.data.alerts || []);
    }
  }, [initialQuery.data]);

  useEffect(() => {
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
          onClick={() => {
            initialQuery.refetch();
            remainingQuery.refetch();
          }}
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
        totalRecords={initialQuery.data?.total_count || 0}
        isLoading={initialQuery.isLoading || remainingQuery.isLoading}
        onEntitySelect={handleEntitySelect}
        selectedEntity={selectedEntity}
        onLoadMore={handleLoadMore}
        hasMore={currentAlerts.length < (initialQuery.data?.total_count || 0)}
      />
      
      {(initialQuery.isLoading || remainingQuery.isLoading) && currentAlerts.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Loading data... ({currentAlerts.length} / {initialQuery.data?.total_count || 0})
        </div>
      )}
    </div>
  );
};

export default Index;