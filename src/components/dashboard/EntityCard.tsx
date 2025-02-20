
import React, { useState } from "react";
import { Circle, Shield, Flame, Skull, Activity } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

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
    icon: JSX.Element;
  } => {
    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "#FF1A1A",
      textColor: "text-[#FF1A1A]",
      bgColor: "bg-[#FF1A1A]/5",
      lineColor: "bg-[#FF1A1A]",
      icon: <Skull className="w-5 h-5 text-[#FF1A1A] animate-pulse" />
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "#FF3D00",  // More distinct from MEDIUM
      textColor: "text-[#FF3D00]",
      bgColor: "bg-[#FF3D00]/5",
      lineColor: "bg-[#FF3D00]",
      icon: <Flame className="w-5 h-5 text-[#FF3D00]" />
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "#FFB100",  // More golden orange
      textColor: "text-[#FFB100]",
      bgColor: "bg-[#FFB100]/5",
      lineColor: "bg-[#FFB100]",
      icon: <Activity className="w-5 h-5 text-[#FFB100]" />
    };
    return { 
      level: "LOW", 
      color: "#4ADE80",
      textColor: "text-[#4ADE80]",
      bgColor: "bg-[#4ADE80]/5",
      lineColor: "bg-[#4ADE80]",
      icon: <Shield className="w-5 h-5 text-[#4ADE80]" />
    };
  };

  const { level, textColor, bgColor, lineColor, icon } = getRiskLevel(score);

  // SVG path for cardiogram
  const cardiogramPath = "M0,10 L5,10 L7,2 L9,18 L11,10 L13,10 L15,6 L17,14 L19,10 L21,10";

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
              <div className="relative">
                <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center 
                  border border-[#5856D6]/20`}>
                  {icon}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#5856D6]/10 
                  border border-[#5856D6]/20 flex items-center justify-center">
                  <Circle className="w-3 h-3 text-[#9b87f5]" />
                </div>
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

            <div className="flex items-center justify-end gap-10">
              <div className="flex flex-col items-start w-[130px]">
                <span className="text-xs uppercase text-[#9b87f5]/70 mb-2">Risk Level</span>
                <div className="w-full">
                  <span className={`text-sm font-medium tracking-wider uppercase ${textColor}`}>
                    {level}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="cardiogram relative w-16 h-5 overflow-hidden opacity-70 flex-shrink-0">
                  <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 22 20" fill="none" 
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d={cardiogramPath}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`${textColor} stroke-current`}
                    />
                  </svg>
                </div>

                <div className="relative min-w-[80px] text-right">
                  <div className={`font-mono font-bold text-2xl tabular-nums ${textColor}`}>
                    {score.toFixed(1)}
                  </div>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#5856D6]/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${lineColor} transition-all duration-300`}
                      style={{ width: `${Math.min((score / 200) * 100, 100)}%` }}
                    />
                  </div>
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
