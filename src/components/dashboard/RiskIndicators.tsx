
import { useState } from "react";
import RiskScoreDisplay from "../widgets/RiskScoreDisplay";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock, Users, Shield } from "lucide-react";

interface RiskIndicatorsProps {
  level: string;
  textColor: string;
  riskScore: number;
  timestamp?: string;
  linkedUsers?: string[];
  mitreTactics?: string[];
}

const RiskIndicators = ({ 
  level,
  textColor,
  riskScore,
  timestamp = "N/A",
  linkedUsers = [],
  mitreTactics = []
}: RiskIndicatorsProps) => {
  const getLevelBackground = () => {
    switch(level) {
      case "CRITICAL":
        return "bg-[#FF3B30]/10";
      case "HIGH":
        return "bg-[#FF9500]/10";
      case "MEDIUM":
        return "bg-[#FFB340]/10";
      default:
        return "bg-[#34C759]/10";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <span className="text-[11px] uppercase text-[#9b87f5]/60">Risk Level</span>
        <Popover>
          <PopoverTrigger asChild>
            <button 
              className={`px-2 py-0.5 rounded text-sm font-bold tracking-wider uppercase 
                ${textColor} ${getLevelBackground()}
                hover:opacity-80 transition-all cursor-pointer
                border border-current border-opacity-20`}
            >
              {level}
            </button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-80 bg-[#0A0B0F] border border-[#5856D6]/20 
              text-[#D6BCFA] p-4 space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9b87f5]" />
                <span className="text-sm">Detected: {timestamp}</span>
              </div>
              
              {linkedUsers.length > 0 && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-[#9b87f5] mt-1" />
                  <div>
                    <span className="text-sm font-medium">Linked Users:</span>
                    <ul className="mt-1 space-y-1">
                      {linkedUsers.map((user, index) => (
                        <li key={index} className="text-sm text-[#9b87f5]/80">{user}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {mitreTactics.length > 0 && (
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#9b87f5] mt-1" />
                  <div>
                    <span className="text-sm font-medium">MITRE ATT&CK:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {mitreTactics.map((tactic, index) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-0.5 rounded-full text-xs
                            bg-[#5856D6]/10 border border-[#5856D6]/20"
                        >
                          {tactic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <RiskScoreDisplay 
        score={riskScore}
        textColor={textColor}
      />
    </div>
  );
};

export default RiskIndicators;
