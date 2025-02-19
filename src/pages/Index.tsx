
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Alert } from "@/components/dashboard/types";
import { useQuery } from "@tanstack/react-query";

const INITIAL_BATCH_SIZE = 50;
const TOTAL_BATCH_SIZE = 500;

const Index = () => {
  const { toast } = useToast();
  const [timeFrame, setTimeFrame] = useState("1d");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntity, setSelectedEntity] = useState<{ type: "userorigin" | "userimpacted" | "computersimpacted"; id: string } | null>(null);
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>([]);
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);

  const fetchAlerts = async (batchSize: number, page: number): Promise<{ alerts: Alert[]; total_count: number }> => {
    console.log('Fetching outlier alerts:', { batchSize, page, timeFrame });
    
    const response = await fetch(`/api/alerts_outliers?page=${page}&per_page=${batchSize}&timeframe=${timeFrame}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
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

  const initialQuery = useQuery({
    queryKey: ['initial-alerts', timeFrame],
    queryFn: () => fetchAlerts(INITIAL_BATCH_SIZE, 1),
    refetchInterval: 30 * 1000,
    staleTime: 25 * 1000,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Initial query error:', error);
          toast({
            title: "Error fetching data",
            description: "Failed to load alerts. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  });

  const remainingQuery = useQuery({
    queryKey: ['remaining-alerts', currentPage, timeFrame],
    queryFn: () => fetchAlerts(INITIAL_BATCH_SIZE, currentPage),
    enabled: !!initialQuery.data?.alerts?.length && currentAlerts.length < TOTAL_BATCH_SIZE,
    staleTime: 25 * 1000,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Remaining query error:', error);
          toast({
            title: "Error fetching additional data",
            description: "Failed to load more alerts. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  });

  useEffect(() => {
    if (initialQuery.data) {
      setCurrentAlerts(initialQuery.data.alerts);
      setAllAlerts(initialQuery.data.alerts);
    }
  }, [initialQuery.data]);

  useEffect(() => {
    if (remainingQuery.data?.alerts) {
      setCurrentAlerts(prev => {
        const newAlerts = [...prev];
        remainingQuery.data.alerts.forEach(alert => {
          if (!newAlerts.find(a => a.id === alert.id)) {
            newAlerts.push(alert);
          }
        });
        return newAlerts;
      });
      setAllAlerts(prev => {
        const newAlerts = [...prev];
        remainingQuery.data.alerts.forEach(alert => {
          if (!newAlerts.find(a => a.id === alert.id)) {
            newAlerts.push(alert);
          }
        });
        return newAlerts;
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

  if (initialQuery.isError || remainingQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1f2c] p-4 sm:p-6 md:p-8">
        <div className="text-red-500 text-base sm:text-lg md:text-xl mb-4 text-center">
          Error loading dashboard data
        </div>
        <button 
          onClick={() => {
            initialQuery.refetch();
            remainingQuery.refetch();
          }}
          className="px-4 py-2 bg-blue-500 text-white text-sm sm:text-base rounded-lg 
            hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2c] font-sans antialiased">
      <div className="max-w-[2560px] mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] mb-6 md:mb-8 tracking-tight">
            ATT&CK User Behavior Analytics
          </h1>
          
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
        </div>
      </div>
      
      {(initialQuery.isLoading || remainingQuery.isLoading) && currentAlerts.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg
          text-sm sm:text-base backdrop-blur-sm">
          Loading data... ({currentAlerts.length} / {initialQuery.data?.total_count || 0})
        </div>
      )}
    </div>
  );
};

export default Index;
