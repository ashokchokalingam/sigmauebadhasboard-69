
import React, { useState } from "react";
import { Circle, Shield, Flame, Skull, Activity, HelpCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import EntityCardRiskGauge from "./EntityCardRiskGauge";

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

  const getRiskIcon = (score: number) => {
    if (score >= 150) return <Skull className="w-5 h-5 text-[#ea384c] animate-pulse" />;
    if (score >= 100) return <Flame className="w-5 h-5 text-[#F97316]" />;
    if (score >= 80) return <Activity className="w-5 h-5 text-[#F97316]" />;
    return <Shield className="w-5 h-5 text-[#28c76f]" />;
  };

  const getRiskColor = (score: number) => {
    if (score >= 150) return "from-[#ea384c]/10 to-transparent";
    if (score >= 80) return "from-[#F97316]/10 to-transparent";
    return "from-[#28c76f]/10 to-transparent";
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "group relative p-4 rounded-lg cursor-pointer",
            "transition-all duration-300 ease-in-out",
            "border border-blue-500/10 hover:border-blue-500/20",
            "bg-black/40 hover:bg-black/50",
            isHovered && "transform-gpu -translate-y-0.5"
          )}
        >
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-20",
            getRiskColor(score),
            "rounded-lg transition-opacity duration-300",
            "group-hover:opacity-30"
          )} />

          <div className="relative flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 
                flex items-center justify-center">
                  {getRiskIcon(score)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500/10 
                border border-blue-500/20 flex items-center justify-center">
                  <Circle className="w-3 h-3 text-blue-400" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-200 group-hover:text-white">
                  {id}
                </h3>
                <p className="text-xs text-blue-400/70 group-hover:text-blue-400">
                  {uniqueTitles} unique anomalies
                </p>
              </div>
            </div>

            <EntityCardRiskGauge riskScore={riskScore} />
          </div>
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent 
        className="w-80 bg-black/90 border border-blue-500/20 backdrop-blur-xl"
        align="end"
      >
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-200">Entity Details</h4>
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between text-gray-400">
              <span>Event Count:</span>
              <span className="font-medium text-gray-200">{eventCount}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Unique Anomalies:</span>
              <span className="font-medium text-gray-200">{uniqueTitles}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Risk Score:</span>
              <span className="font-medium text-gray-200">{score.toFixed(1)}</span>
            </div>
          </div>
          <div className="pt-2 text-xs text-gray-400">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400 mt-0.5" />
              <p>Click to view detailed timeline and analysis of detected anomalies.</p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default EntityCard;
