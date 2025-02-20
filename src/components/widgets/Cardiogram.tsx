
import { memo } from "react";

interface CardiogramProps {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

const Cardiogram = memo(({ riskLevel }: CardiogramProps) => {
  const getColor = () => {
    switch (riskLevel) {
      case "CRITICAL": return "#ea384c";
      case "HIGH": return "#F97316";
      case "MEDIUM": return "#F97316";
      case "LOW": return "#4ADE80";
    }
  };

  return (
    <div className="cardiogram">
      <svg width="100%" height="100%" viewBox="0 0 100 20">
        <path
          d={riskLevel === "CRITICAL" || riskLevel === "HIGH" 
            ? "M 0 10 L 20 10 L 25 3 L 30 17 L 35 3 L 40 17 L 45 3 L 50 17 L 55 3 L 60 17 L 65 10 L 100 10"
            : "M 0 10 L 20 10 L 25 7 L 30 13 L 35 7 L 40 13 L 45 7 L 50 13 L 55 7 L 60 13 L 65 10 L 100 10"
          }
          fill="none"
          stroke={getColor()}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
});

Cardiogram.displayName = "Cardiogram";

export default Cardiogram;
