import { User, AlertTriangle, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface RiskyUser {
  id: string;
  name: string;
  riskScore: number;
  trend: "up" | "down" | "stable";
  avatar?: string;
}

const HighRiskUsersImpactedWidget = () => {
  const { data: riskyUsers } = useQuery({
    queryKey: ['riskyUsersImpacted'],
    queryFn: async () => {
      // Simulated data - replace with actual API endpoint when available
      return [
        { id: "1", name: "ashok.chokalingam", riskScore: 9.4, trend: "up" },
        { id: "2", name: "zavely", riskScore: 8.9, trend: "stable" },
        { id: "3", name: "zaynah", riskScore: 8.6, trend: "down" },
        { id: "4", name: "zaynes", riskScore: 9.1, trend: "up" }
      ] as RiskyUser[];
    }
  });

  const getRiskClass = (score: number) => {
    if (score >= 9) return "text-red-500";
    if (score >= 8) return "text-orange-500";
    return "text-yellow-500";
  };

  return (
    <div className="bg-[#1e2c3d]/40 border border-blue-500/10 rounded-xl overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-purple-400/80" />
          <span className="text-lg font-semibold text-blue-100/90">High Risk Users Impacted</span>
        </div>
        <span className="text-sm font-medium text-purple-400/80">
          {riskyUsers?.length || 0} risky users
        </span>
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
          <input
            type="text"
            placeholder="Search entities..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1e2c3d]/40 hover:bg-[#1e2c3d]/60 
              border border-blue-500/5 hover:border-blue-500/10 rounded-lg
              text-sm text-blue-100/90 placeholder:text-blue-400/50
              transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/10 scrollbar-track-transparent">
        {riskyUsers?.map((user) => (
          <div key={user.id} 
            className="group relative flex items-center p-4 rounded-lg h-[72px]
              transition-all duration-300 cursor-pointer
              bg-[#1e2c3d]/40 hover:bg-[#1e2c3d]/60
              border border-blue-500/5 hover:border-blue-500/10">
            <div className="flex items-center w-full">
              <div className="flex items-center gap-4 flex-[0_0_50%]">
                <div className="relative w-10 h-10 rounded-full bg-blue-950/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400/70" />
                </div>
                <div className="flex flex-col min-w-[120px]">
                  <span className="font-mono text-base text-blue-200/90 font-medium group-hover:text-blue-100 truncate max-w-[200px]">
                    {user.name}
                  </span>
                  <span className="text-sm text-[#60A5FA] font-semibold mt-1 drop-shadow-[0_0_3px_rgba(96,165,250,0.3)]">
                    Risk Level: High
                  </span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-end">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <span className={`text-base font-medium ${getRiskClass(user.riskScore)}`}>
                      Risk
                    </span>
                    <span className={`text-xs font-medium -mt-0.5 ${getRiskClass(user.riskScore)}`}>
                      critical
                    </span>
                  </div>
                  <div className="relative w-20 h-6 overflow-hidden">
                    <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 600 100" preserveAspectRatio="none">
                      <path
                        d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                        className={`stroke-current fill-none stroke-[4] ${getRiskClass(user.riskScore)}`}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className={`font-bold text-3xl min-w-[70px] text-right ${getRiskClass(user.riskScore)}`}>
                    {user.riskScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighRiskUsersImpactedWidget;