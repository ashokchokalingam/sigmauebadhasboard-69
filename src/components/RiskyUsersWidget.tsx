import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Loader2, Skull, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskyUser {
  user_id: string;
  risk_score: number;
}

interface ApiResponse {
  risky_users: RiskyUser[];
}

// Mock data for testing
const mockData: ApiResponse = {
  risky_users: [
    { user_id: "john.doe", risk_score: 85 },
    { user_id: "jane.smith", risk_score: 75 },
    { user_id: "bob.wilson", risk_score: 65 }
  ]
};

const RiskyUsersWidget = () => {
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['risky-users'],
    queryFn: async () => {
      console.log('Starting to fetch risky users...');
      
      // For testing, return mock data
      // return mockData;
      
      try {
        const response = await fetch('http://172.16.0.75:5001/api/risky_users');
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const jsonData = await response.json();
        console.log('Received data:', jsonData);
        
        if (!jsonData || !Array.isArray(jsonData.risky_users)) {
          console.error('Invalid response format:', jsonData);
          throw new Error('Invalid API response format');
        }
        
        return jsonData;
      } catch (err) {
        console.error('Error fetching risky users:', err);
        // For now, return mock data if API fails
        return mockData;
      }
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    refetchOnReconnect: false, // Don't refetch when reconnecting
    retry: false // Don't retry failed requests
  });

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-[#FF4D4D]"; // Bright Red
    if (score >= 50) return "text-[#FF9900]"; // Bright Orange
    return "text-[#FFD700]"; // Gold
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return "bg-[#FF4D4D]/10";
    if (score >= 50) return "bg-[#FF9900]/10";
    return "bg-[#FFD700]/10";
  };

  const getRiskBorderColor = (score: number) => {
    if (score >= 80) return "border-[#FF4D4D]/20";
    if (score >= 50) return "border-[#FF9900]/20";
    return "border-[#FFD700]/20";
  };

  console.log('Widget state:', { isLoading, error, data });

  if (error) {
    return (
      <Card className="bg-black/40 border-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-100">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Error Loading Risk Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Failed to load risky users data. Using mock data for demonstration.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-red-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-100">
          <Skull className="h-5 w-5 text-red-500" />
          High Risk Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid gap-4">
              {data?.risky_users && data.risky_users.length > 0 ? (
                data.risky_users
                  .sort((a, b) => b.risk_score - a.risk_score)
                  .map((user, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]",
                        getRiskBgColor(user.risk_score),
                        getRiskBorderColor(user.risk_score)
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-mono text-gray-200">{user.user_id || 'Unknown User'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-4xl font-bold tracking-tighter",
                            getRiskColor(user.risk_score)
                          )}>
                            {user.risk_score}
                          </span>
                          <span className="text-sm text-gray-400 whitespace-nowrap">Risk Score</span>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-center text-gray-400 py-4">
                  {data ? 'No high-risk users detected' : 'No data available'}
                </p>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskyUsersWidget;