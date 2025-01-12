import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Alert } from "@/components/dashboard/types";
import { useQuery } from "@tanstack/react-query";

const INITIAL_BATCH_SIZE = 100;
const TOTAL_BATCH_SIZE = 1000;

const Index = () => {
  const [selectedEntity, setSelectedEntity] = useState<{ 
    type: "user" | "computer" | "origin"; 
    id: string; 
  } | null>(null);
  
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>([]);
  const [currentTotalRecords, setCurrentTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);

  // First query: Get initial alerts
  const { isLoading: isLoadingInitial } = useQuery({
    queryKey: ['initial-alerts'],
    queryFn: async () => {
      const response = await fetch(`/api/alerts?page=1&per_page=${INITIAL_BATCH_SIZE}`);
      if (!response.ok) throw new Error('Failed to fetch initial alerts');
      const data = await response.json();
      setCurrentAlerts(data.alerts);
      setAllAlerts(data.alerts);
      setCurrentTotalRecords(data.total_count);
      return data;
    },
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  });

  // Second query: Get remaining alerts
  const { isLoading: isLoadingRemaining } = useQuery({
    queryKey: ['remaining-alerts', currentPage],
    queryFn: async () => {
      if (currentAlerts.length >= TOTAL_BATCH_SIZE) return null;
      
      const response = await fetch(`/api/alerts?page=2&per_page=${TOTAL_BATCH_SIZE - INITIAL_BATCH_SIZE}`);
      if (!response.ok) throw new Error('Failed to fetch remaining alerts');
      const data = await response.json();
      
      setCurrentAlerts(prev => [...prev, ...data.alerts]);
      setAllAlerts(prev => [...prev, ...data.alerts]);
      return data;
    },
    enabled: currentAlerts.length > 0 && currentAlerts.length < TOTAL_BATCH_SIZE,
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  });

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
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
        onEntitySelect={setSelectedEntity}
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