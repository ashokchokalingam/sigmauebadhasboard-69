import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Alert } from "@/components/dashboard/types";
import { useQuery } from "@tanstack/react-query";

const INITIAL_BATCH_SIZE = 100;
const TOTAL_BATCH_SIZE = 1000;

const Index = () => {
  const [selectedEntity, setSelectedEntity] = useState<{ type: "userorigin" | "userimpacted" | "computersimpacted"; id: string } | null>(null);
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>([]);
  const [currentTotalRecords, setCurrentTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);

  // Initial alerts query
  const { isLoading: isLoadingInitial } = useQuery({
    queryKey: ['initial-alerts'],
    queryFn: async () => {
      try {
        console.log('Fetching initial alerts...');
        const response = await fetch(`/api/alerts?page=1&per_page=${INITIAL_BATCH_SIZE}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Response not OK:', response.status, errorData);
          throw new Error(`Failed to fetch initial alerts: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Initial alerts data:', data);
        
        if (!data.alerts) {
          console.error('No alerts in response:', data);
          throw new Error('Invalid response format');
        }
        
        setCurrentAlerts(data.alerts);
        setAllAlerts(data.alerts);
        setCurrentTotalRecords(data.total_count);
        return data;
      } catch (error) {
        console.error('Error fetching initial alerts:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: 1000, // Wait 1 second between retries
  });

  // Remaining alerts query
  const { isLoading: isLoadingRemaining } = useQuery({
    queryKey: ['remaining-alerts', currentPage],
    queryFn: async () => {
      if (currentAlerts.length >= TOTAL_BATCH_SIZE) return null;
      
      try {
        console.log('Fetching remaining alerts...');
        const response = await fetch(`/api/alerts?page=2&per_page=${TOTAL_BATCH_SIZE - INITIAL_BATCH_SIZE}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch remaining alerts');
        }
        
        const data = await response.json();
        console.log('Remaining alerts data:', data);
        
        if (data.alerts && Array.isArray(data.alerts)) {
          setCurrentAlerts(prev => [...prev, ...data.alerts]);
          setAllAlerts(prev => [...prev, ...data.alerts]);
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching remaining alerts:', error);
        toast({
          title: "Error",
          description: "Failed to load additional data. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: currentAlerts.length > 0 && currentAlerts.length < TOTAL_BATCH_SIZE,
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  });

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleEntitySelect = (entity: { type: "userorigin" | "userimpacted" | "computersimpacted"; id: string } | null) => {
    setSelectedEntity(entity);
  };

  if (isLoadingInitial && currentAlerts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1f2c]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2c]">
      <DashboardLayout
        alerts={currentAlerts}
        allAlerts={allAlerts}
        totalRecords={currentTotalRecords}
        isLoading={isLoadingInitial || isLoadingRemaining}
        onEntitySelect={handleEntitySelect}
        selectedEntity={selectedEntity}
        onLoadMore={handleLoadMore}
        hasMore={currentAlerts.length < TOTAL_BATCH_SIZE}
      />
      
      {(isLoadingInitial || isLoadingRemaining) && currentAlerts.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Loading data... ({currentAlerts.length} / {TOTAL_BATCH_SIZE})
        </div>
      )}
    </div>
  );
};

export default Index;