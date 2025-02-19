
import React from "react";
import { AlertTriangle, Shield, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityCardRiskGaugeProps {
  riskScore: string | null;
}

const EntityCardRiskGauge = ({ riskScore }: EntityCardRiskGaugeProps) => {
  const score = riskScore ? parseInt(riskScore) : 0;

  const getRiskLevel = (score: number) => {
    if (score >= 200) return { 
      level: "CRITICAL", 
      color: "#ea384c",
      bgColor: "bg-[#ea384c]/10",
      icon: ShieldAlert,
      pulseEffect: true
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "#ea384c",
      bgColor: "bg-[#ea384c]/10",
      icon: AlertTriangle,
      pulseEffect: false
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "#F97316",
      bgColor: "bg-[#F97316]/10",
      icon: AlertTriangle,
      pulseEffect: false
    };
    return { 
      level: "LOW", 
      color: "#28c76f",
      bgColor: "bg-[#28c76f]/10",
      icon: Shield,
      pulseEffect: false
    };
  };

  const { level, color, bgColor, icon: Icon, pulseEffect } = getRiskLevel(score);

  return (
    <div className={cn(
      "relative rounded-lg px-4 py-2",
      bgColor,
      "transition-all duration-300"
    )}>
      <div className="flex flex-col">
        {/* Risk Level Text */}
        <div className="text-xs font-medium mb-1 opacity-70" style={{ color }}>
          {level} RISK
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "relative",
            pulseEffect && "animate-pulse"
          )}>
            <Icon 
              className="w-5 h-5 transition-colors duration-300"
              style={{ color }}
            />
            {pulseEffect && (
              <div 
                className="absolute inset-0 rounded-full blur-sm opacity-50"
                style={{ backgroundColor: color }}
              />
            )}
          </div>
          
          <div className={cn(
            "font-mono font-bold text-2xl transition-colors duration-300",
            pulseEffect && "animate-pulse"
          )}
            style={{ color }}
          >
            {score}
          </div>
        </div>

        {/* Cardiogram SVG */}
        <div className="relative w-full h-6 overflow-hidden opacity-30 mt-1">
          <svg 
            className="w-[200%] h-full animate-cardiogram"
            viewBox="0 0 600 100" 
            preserveAspectRatio="none"
            style={{ color }}
          >
            <path
              d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
              className="stroke-current fill-none stroke-[4]"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default EntityCardRiskGauge;
