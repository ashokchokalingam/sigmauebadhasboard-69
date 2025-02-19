
import React from "react";
import { cn } from "@/lib/utils";

interface EntityCardRiskGaugeProps {
  riskScore: string | null;
}

const EntityCardRiskGauge = ({ riskScore }: EntityCardRiskGaugeProps) => {
  const score = riskScore ? parseInt(riskScore) : 0;
  const progress = Math.min((score / 200) * 100, 100); // Convert to percentage

  const getRiskLevel = (score: number) => {
    if (score >= 200) return { level: "HIGH", color: "#ea384c" };
    if (score >= 100) return { level: "MEDIUM", color: "#F97316" };
    if (score >= 50) return { level: "LOW", color: "#28c76f" };
    return { level: "LOW", color: "#28c76f" };
  };

  const { color } = getRiskLevel(score);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="flex-1 h-20 relative">
          {/* Arc Container */}
          <svg 
            className="w-20 h-20 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background Arc */}
            <path
              d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,-45 0 1 1 0,-90"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="4"
              className="opacity-20"
            />
            
            {/* Colored Progress Arc */}
            <path
              d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,-45 0 1 1 0,-90"
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                strokeDasharray: "282.7",
                strokeDashoffset: `${282.7 - (progress / 100) * 282.7}`,
                transition: "stroke-dashoffset 0.5s ease-in-out, stroke 0.5s ease-in-out"
              }}
            />
          </svg>

          {/* Risk Score */}
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold font-mono" style={{ color }}>
            {score}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityCardRiskGauge;
