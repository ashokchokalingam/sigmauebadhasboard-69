import React, { useState } from "react";
import { Monitor, User, ArrowUp, ArrowDown } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Sparkline from "./Sparkline";

interface EntityCardProps {
  id: string;
  eventCount: number;
  uniqueTitles: number;
  riskScore: string | null;
  onClick: () => void;
}

const EntityCard = ({ id, eventCount, uniqueTitles, riskScore, onClick }: EntityCardProps) => {
  const score = riskScore ? parseFloat(riskScore) : 0;
  const [isHovered, setIsHovered] = useState(false);

  const getRiskLevel = (score: number): { 
    level: string; 
    color: string;
    textColor: string; 
    bgColor: string;
    lineColor: string;
    barWidth: number;
  } => {
    // Calculate relative width based on risk level
    const getBarWidth = (score: number): number => {
      if (score >= 150) return Math.min((score / 200) * 100, 100); // CRITICAL
      if (score >= 100) return (score / 150) * 75; // HIGH
      if (score >= 50) return (score / 100) * 50; // MEDIUM
      return (score / 50) * 25; // LOW
    };

    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "#FF1A1A",
      textColor: "text-[#FF1A1A]",
      bgColor: "bg-[#FF1A1A]/5",
      lineColor: "bg-[#FF1A1A]",
      barWidth: getBarWidth(score)
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "#FF3D00",
      textColor: "text-[#FF3D00]",
      bgColor: "bg-[#FF3D00]/5",
      lineColor: "bg-[#FF3D00]",
      barWidth: getBarWidth(score)
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "#FFB100",
      textColor: "text-[#FFB100]",
      bgColor: "bg-[#FFB100]/5",
      lineColor: "bg-[#FFB100]",
      barWidth: getBarWidth(score)
    };
    return { 
      level: "LOW", 
      color: "#4ADE80",
      textColor: "text-[#4ADE80]",
      bgColor: "bg-[#4ADE80]/5",
      lineColor: "bg-[#4ADE80]",
      barWidth: getBarWidth(score)
    };
  };

  const { level, color, textColor, bgColor, lineColor, barWidth } = getRiskLevel(score);
  
  // For demo purposes, determine trend based on score value
  // In real implementation, this should come from historical data
  const riskIncreasing = score > 100;
  const riskChangePercent = ((score - 50) / 50 * 100).toFixed(1);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "group relative p-4 rounded-lg cursor-pointer h-[84px]",
            "transition-all duration-300 ease-in-out",
            "border border-[#5856D6]/30 hover:border-[#5856D6]/50",
            "bg-[#0A0B0F] hover:bg-[#12131A]",
            isHovered && "transform-gpu -translate-y-0.5"
          )}
        >
          <div className="relative flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center
                border border-[#5856D6]/20`}>
                <User className={`w-5 h-5 ${textColor}`} />
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#D6BCFA] group-hover:text-white">
                  {id}
                </h3>
                <p className="text-xs text-[#9b87f5]/70 group-hover:text-[#9b87f5]">
                  {uniqueTitles} unique anomalies
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-6">
              <div className="flex flex-col items-start w-[130px]">
                <span className="text-xs uppercase text-[#9b87f5]/70 mb-2">Risk Level</span>
                <div className="w-full">
                  <span className={`text-sm font-medium tracking-wider uppercase ${textColor}`}>
                    {level}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="opacity-70 hover:opacity-100 transition-opacity">
                  <Sparkline riskLevel={level as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} color={color} />
                </div>
              </div>

              <div className="relative min-w-[140px]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-end gap-3 mb-1">
                        {riskIncreasing ? (
                          <ArrowUp className={`w-4 h-4 ${textColor}`} />
                        ) : (
                          <ArrowDown className={`w-4 h-4 ${textColor}`} />
                        )}
                        <div className={`font-mono font-bold text-2xl tabular-nums ${textColor}`}>
                          {score.toFixed(1)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      className="bg-[#0A0B0F]/90 border border-[#5856D6]/20 backdrop-blur-xl"
                    >
                      <p className="text-xs text-[#D6BCFA]">
                        {riskIncreasing 
                          ? `Risk increased by ${riskChangePercent}% over the last 24 hours`
                          : `Risk decreased by ${Math.abs(Number(riskChangePercent))}% due to reduced anomalies`
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="relative h-2 bg-[#5856D6]/10 rounded-full overflow-hidden">
                  {/* Background segments for risk levels */}
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 border-r border-[#5856D6]/20" />
                    <div className="flex-1 border-r border-[#5856D6]/20" />
                    <div className="flex-1 border-r border-[#5856D6]/20" />
                    <div className="flex-1" />
                  </div>
                  
                  {/* Current progress */}
                  <div 
                    className={`h-full ${lineColor} transition-all duration-300`}
                    style={{ 
                      width: `${barWidth}%`,
                      boxShadow: `0 0 10px ${getRiskLevel(score).color}`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent 
        className="w-80 bg-[#0A0B0F]/90 border border-[#5856D6]/20 backdrop-blur-xl"
        align="end"
      >
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#D6BCFA]">Entity Details</h4>
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between text-[#9b87f5]/70">
              <span>Event Count:</span>
              <span className="font-medium text-[#D6BCFA]">{eventCount}</span>
            </div>
            <div className="flex justify-between text-[#9b87f5]/70">
              <span>Unique Anomalies:</span>
              <span className="font-medium text-[#D6BCFA]">{uniqueTitles}</span>
            </div>
            <div className="flex justify-between text-[#9b87f5]/70">
              <span>Risk Score:</span>
              <span className="font-medium text-[#D6BCFA]">{score.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default EntityCard;
