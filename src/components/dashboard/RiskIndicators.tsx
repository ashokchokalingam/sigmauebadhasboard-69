
import { useState } from "react";
import RiskScoreDisplay from "../widgets/RiskScoreDisplay";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock, Users, Shield, AlertTriangle } from "lucide-react";

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
  const getLevelStyles = () => {
    switch(level) {
      case "CRITICAL":
        return {
          bg: "bg-transparent",
          text: "text-[#FF3B30]",
          border: "border-[#FF3B30]",
          shadow: ""
        };
      case "HIGH":
        return {
          bg: "bg-transparent",
          text: "text-[#FF9500]",
          border: "border-[#FF9500]",
          shadow: ""
        };
      case "MEDIUM":
        return {
          bg: "bg-[#FFB340]/10",
          text: "text-[#FFB340]",
          border: "border-[#FFB340]/20",
          shadow: ""
        };
      default:
        return {
          bg: "bg-[#34C759]/10",
          text: "text-[#34C759]",
          border: "border-[#34C759]/20",
          shadow: ""
        };
    }
  };

  const styles = getLevelStyles();

  return (
    <div className="flex items-center justify-end w-full gap-6">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[11px] uppercase text-[#9b87f5]/60 tracking-wide">
          Risk Level
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <button 
              className={`px-2 py-0.5 rounded text-[11px] font-medium tracking-wider uppercase 
                ${styles.bg} ${styles.text} ${styles.border} ${styles.shadow}
                hover:opacity-90 transition-all cursor-pointer backdrop-blur-[1px]
                border flex items-center justify-center h-[24px] w-[70px]`}
            >
              <span className="w-full text-center inline-flex items-center justify-center gap-1.5">
                {level}
                {level === "CRITICAL" && (
                  <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5] text-[#FF3B30] flex-shrink-0" />
                )}
              </span>
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

      <RiskScoreDisplay score={riskScore} textColor={textColor} />
    </div>
  );
};

export default RiskIndicators;
