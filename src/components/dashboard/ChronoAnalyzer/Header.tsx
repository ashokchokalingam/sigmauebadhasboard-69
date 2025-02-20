
import { Button } from "@/components/ui/button";
import { Watch } from "lucide-react";

export const ChronoAnalyzerHeader = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#1E1E2F] border-b border-[#5856D6]/20">
      <div className="flex items-center gap-2">
        <Watch className="w-5 h-5 text-[#9b87f5]" />
        <h2 className="text-lg font-semibold text-[#9b87f5]">Chrono Analyzer</h2>
      </div>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          size="sm"
          className="bg-[#33C3F0]/10 text-[#33C3F0]/70 border-[#33C3F0]/20 hover:bg-[#33C3F0]/20 hover:text-[#33C3F0]"
        >
          Anomalies
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-[#33C3F0]/10 text-[#33C3F0] border-[#33C3F0]/30 shadow-[0_0_10px_rgba(51,195,240,0.2)]"
        >
          ML Outliers
        </Button>
      </div>
    </div>
  );
};
