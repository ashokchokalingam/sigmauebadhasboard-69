import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Alert } from "@/components/dashboard/types";
import { AlertTriangle } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";

const Index = () => {
  const [selectedEntity, setSelectedEntity] = useState<{ type: "user" | "computer"; id: string } | null>(null);
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>([]);
  const [currentTotalRecords, setCurrentTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());
  const { toast } = useToast();
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  
  const { isLoading, error, data, refetch } = useAlerts(currentPage, (alerts, totalRecords) => {
    const now = new Date();
    const newAlerts = alerts.filter(alert => 
      new Date(alert.system_time) > lastFetchTime
    );
    
    if (currentPage === 1) {
      setCurrentAlerts(alerts);
      setAllAlerts(alerts);
    } else {
      setCurrentAlerts(prev => [...newAlerts, ...prev]);
      setAllAlerts(prev => [...newAlerts, ...prev]);
    }
    
    setLastFetchTime(now);
    setCurrentTotalRecords(totalRecords);
  });

  const handleLoadMore = async (): Promise<void> => {
    setCurrentPage(prev => prev + 1);
    await refetch();
  };

  if (isLoading && currentAlerts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1f2c]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch alerts. Please check your connection and try again.",
      variant: "destructive",
    });
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1f2c]">
        <div className="text-red-500 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p>Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2c]">
      <DashboardLayout
        alerts={currentAlerts}
        allAlerts={allAlerts}
        totalRecords={currentTotalRecords}
        isLoading={isLoading}
        onEntitySelect={setSelectedEntity}
        selectedEntity={selectedEntity}
        onLoadMore={handleLoadMore}
        hasMore={data?.hasMore || false}
      />
    </div>
  );
};

export default Index;