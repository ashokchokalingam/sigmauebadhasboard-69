import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Alert } from "@/components/dashboard/types";
import { useQuery } from "@tanstack/react-query";
import TimeFrameSelector from "@/components/TimeFrameSelector";

// Reduced initial batch size for faster initial load
const INITIAL_BATCH_SIZE = 25;
const TOTAL_BATCH_SIZE = 100;

const Index = () => {
  const { toast } = useToast();
  const [timeFrame, setTimeFrame] = useState("1d");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntity, setSelectedEntity] = useState<{ type: "userorigin" | "userimpacted" | "computersimpacted"; id: string } | null>(null);
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>([]);
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);

  // Optimized fetch function with better error handling
  const fetchAlerts = async (batchSize: number, page: number): Promise<{ alerts: Alert[]; total_count: number }> => {
    console.log('Fetching alerts:', { batchSize, page, timeFrame });
    
    const response = await fetch(`/api/alerts?page=${page}&per_page=${batchSize}&timeframe=${timeFrame}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      alerts: data.alerts || [],
      total_count: data.total_count || 0
    };
  };

  // Initial data query with smaller batch size
  const initialQuery = useQuery({
    queryKey: ['initial-alerts', timeFrame],
    queryFn: () => fetchAlerts(INITIAL_BATCH_SIZE, 1),
    staleTime: 30 * 1000, // Cache data for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data for 5 minutes
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Initial query error:', error);
          toast({
            title: "Error loading data",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
        }
      }
    }
  });

  // Remaining data query with pagination
  const remainingQuery = useQuery({
    queryKey: ['remaining-alerts', currentPage, timeFrame],
    queryFn: () => fetchAlerts(INITIAL_BATCH_SIZE, currentPage),
    enabled: !!initialQuery.data?.alerts?.length && currentAlerts.length < TOTAL_BATCH_SIZE,
    staleTime: 30 * 1000,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Remaining query error:', error);
          toast({
            title: "Error loading additional data",
            description: "Some data might be missing",
            variant: "destructive",
          });
        }
      }
    }
  });

  // Update alerts when initial data is loaded
  useEffect(() => {
    if (initialQuery.data) {
      setCurrentAlerts(initialQuery.data.alerts);
      setAllAlerts(initialQuery.data.alerts);
    }
  }, [initialQuery.data]);

  // Update alerts when more data is loaded
  useEffect(() => {
    if (remainingQuery.data?.alerts) {
      setCurrentAlerts(prev => {
        const newAlerts = [...prev];
        const uniqueNewAlerts = remainingQuery.data.alerts.filter(
          alert => !newAlerts.some(existing => existing.id === alert.id)
        );
        return [...newAlerts, ...uniqueNewAlerts];
      });
      
      setAllAlerts(prev => {
        const newAlerts = [...prev];
        const uniqueNewAlerts = remainingQuery.data.alerts.filter(
          alert => !newAlerts.some(existing => existing.id === alert.id)
        );
        return [...newAlerts, ...uniqueNewAlerts];
      });
    }
  }, [remainingQuery.data]);

  const handleLoadMore = () => {
    if (currentAlerts.length < TOTAL_BATCH_SIZE) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleEntitySelect = (entity: { type: "userorigin" | "userimpacted" | "computersimpacted"; id: string } | null) => {
    setSelectedEntity(entity);
  };

  // Show loading state
  if (initialQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1f2c]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
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