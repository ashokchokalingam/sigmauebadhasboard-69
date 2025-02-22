
import { memo } from "react";
import CardiogramSVG from "../dashboard/CardiogramSVG";

interface WaveformDisplayProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const WaveformDisplay = memo(({ level, color }: WaveformDisplayProps) => {
  // Calculate wave size based on risk level
  const getWaveSize = (level: string): string => {
    switch (level) {
      case 'CRITICAL':
        return 'scale-110';
      case 'HIGH':
        return 'scale-105';
      case 'MEDIUM':
        return 'scale-100';
      default:
        return 'scale-95';
    }
  };

  return (
    <div className={`flex items-center gap-1.5 transition-transform duration-300 ${getWaveSize(level)}`}>
      <div className="opacity-70 hover:opacity-100 transition-opacity w-[45px]">
        <CardiogramSVG riskLevel={level} color={color} />
      </div>
    </div>
  );
});

WaveformDisplay.displayName = 'WaveformDisplay';

export default WaveformDisplay;
