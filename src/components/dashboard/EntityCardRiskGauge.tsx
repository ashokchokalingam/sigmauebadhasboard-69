
import React from "react";
import { AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityCardRiskGaugeProps {
  riskScore: string | null;
}

const EntityCardRiskGauge = ({ riskScore }: EntityCardRiskGaugeProps) => {
  const score = riskScore ? parseInt(riskScore) : 0;

  const getRiskLevel = (score: number) => {
    if (score >= 150) return { 
      level: "HIGH RISK", 
      color: "#ea384c",
      bgColor: "bg-gradient-to-r from-[#ea384c]/20 to-[#ea384c]/10",
      icon: AlertTriangle
    };
    if (score >= 80) return { 
      level: "MEDIUM RISK", 
      color: "#F97316",
      bgColor: "bg-gradient-to-r from-[#F97316]/20 to-[#F97316]/10",
      icon: AlertTriangle
    };
    return { 
      level: "LOW RISK", 
      color: "#28c76f",
      bgColor: "bg-gradient-to-r from-[#28c76f]/20 to-[#28c76f]/10",
      icon: Shield
    };
  };

  const { level, color, bgColor, icon: Icon } = getRiskLevel(score);

  return (
    <div className={cn(
      "flex items-center gap-2 min-w-[100px] rounded-lg pl-3 pr-4 py-2",
      bgColor
    )}>
      <Icon 
        className="w-4 h-4 shrink-0"
        style={{ color }}
      />
      <div 
        className="font-mono font-bold text-xl"
        style={{ color }}
      >
        {score}
      </div>

      {/* Cardiogram SVG */}
      <div className="relative w-12 h-4 overflow-hidden opacity-30">
        <svg 
          className="w-[200%] h-full animate-cardiogram"
          viewBox="0 0 600 100" 
          preserveAspectRatio="none"
          style={{ color }}
        >
          <path
            d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
            className="stroke-current fill-none stroke-[3]"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default EntityCardRiskGauge;
