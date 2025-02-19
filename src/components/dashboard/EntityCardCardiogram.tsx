
import React from "react";
import { cn } from "@/lib/utils";

interface EntityCardCardiogramProps {
  isHighRisk: boolean;
}

const EntityCardCardiogram = ({ isHighRisk }: EntityCardCardiogramProps) => {
  return (
    <div className="relative w-24 h-8 overflow-hidden opacity-70">
      <svg 
        className={cn(
          "w-[200%] h-full animate-cardiogram",
          "stroke-[#9b87f5]",
          isHighRisk && "stroke-[#ea384c]"
        )} 
        viewBox="0 0 600 100" 
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
          className="stroke-current fill-none stroke-[4]"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default EntityCardCardiogram;
