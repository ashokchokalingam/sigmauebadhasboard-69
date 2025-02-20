
import React from 'react';

interface CardiogramSVGProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const CardiogramSVG = ({ riskLevel, color }: CardiogramSVGProps) => {
  // Define different paths for each risk level
  const paths = {
    LOW: "M 0 10 Q 5 10 10 10 T 20 10 T 30 10 T 40 8 T 50 10 T 60 10",
    MEDIUM: "M 0 10 Q 5 8 10 12 T 20 8 T 30 12 T 40 8 T 50 12 T 60 10",
    HIGH: "M 0 10 Q 5 5 10 15 T 20 5 T 30 15 T 40 5 T 50 15 T 60 10",
    CRITICAL: "M 0 10 Q 5 2 10 18 T 20 2 T 30 18 T 40 2 T 50 18 T 60 10"
  };

  return (
    <svg
      width="60"
      height="20"
      viewBox="0 0 60 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-60"
    >
      <path
        d={paths[riskLevel]}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-cardiogram"
      />
    </svg>
  );
};

export default CardiogramSVG;
