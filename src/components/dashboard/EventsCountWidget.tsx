
import { useQuery } from "@tanstack/react-query";
import { Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TotalCountResponse {
  critical_count: number;
  high_count: number;
  total_count: number;
}

const EventsCountWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["total-count"],
    queryFn: async () => {
      const response = await fetch("/api/total_count");
      if (!response.ok) {
        throw new Error("Failed to fetch total count");
      }
      return response.json() as Promise<TotalCountResponse>;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <Card className="bg-[#0A0B0F]/60 border border-[#5856D6]/20 hover:border-[#5856D6]/40 
      transition-all duration-300 group backdrop-blur-sm relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#5856D6]/20">
        <CardTitle className="text-sm font-medium text-[#D6BCFA] flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Total Events (24h)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="text-4xl font-bold text-white mb-6">
          {isLoading ? "..." : data?.total_count || 0}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-400">Critical</span>
            </div>
            <span className="font-semibold text-red-500">
              {isLoading ? "..." : data?.critical_count || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-orange-400">High</span>
            </div>
            <span className="font-semibold text-orange-500">
              {isLoading ? "..." : data?.high_count || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsCountWidget;
