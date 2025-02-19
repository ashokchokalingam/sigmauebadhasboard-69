
import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface EntityCardRiskGaugeProps {
  riskScore: string | null;
}

const EntityCardRiskGauge = ({ riskScore }: EntityCardRiskGaugeProps) => {
  const score = riskScore ? parseInt(riskScore) : 0;

  const getRiskLevel = (score: number) => {
    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "#ea384c",
      textGlow: "text-shadow-[0_0_10px_rgba(234,56,76,0.3)]",
      bgGlow: "shadow-[0_0_15px_rgba(234,56,76,0.1)]",
      bgColor: "bg-[#ea384c]",
      pulsing: true
    };
    if (score >= 80) return { 
      level: "MEDIUM", 
      color: "#F97316",
      textGlow: "text-shadow-[0_0_10px_rgba(249,115,22,0.3)]",
      bgGlow: "shadow-[0_0_15px_rgba(249,115,22,0.1)]",
      bgColor: "bg-[#F97316]",
      pulsing: false
    };
    return { 
      level: "LOW", 
      color: "#28c76f",
      textGlow: "text-shadow-[0_0_10px_rgba(40,199,111,0.3)]",
      bgGlow: "shadow-[0_0_15px_rgba(40,199,111,0.1)]",
      bgColor: "bg-[#28c76f]",
      pulsing: false
    };
  };

  const { level, color, textGlow, bgGlow, bgColor, pulsing } = getRiskLevel(score);

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col gap-0.5 items-end">
        <span 
          className={cn(
            "text-xs tracking-wide transition-colors duration-300",
            textGlow
          )}
          style={{ color }}
        >
          Risk Level
        </span>
        <span 
          className={cn(
            "text-xs font-medium tracking-wide transition-colors duration-300",
            textGlow
          )}
          style={{ color }}
        >
          {level}
        </span>
      </div>

      <div className="relative">
        <div 
          className={cn(
            "font-mono font-bold text-2xl px-3 py-1 rounded",
            "transition-all duration-300",
            "border border-white/5",
            "bg-black/40",
            bgGlow,
            pulsing && "animate-[pulse_5s_cubic-bezier(0.4,0,0.6,1)_infinite]"
          )}
          style={{ color }}
        >
          {score.toFixed(1)}
        </div>
        <div className="absolute -bottom-2 left-0 right-0">
          <Progress 
            value={Math.min((score / 200) * 100, 100)} 
            className="h-1 bg-white/5"
            indicatorClassName={cn(bgColor, "transition-all duration-300")}
          />
        </div>
      </div>
    </div>
  );
};

export default EntityCardRiskGauge;
