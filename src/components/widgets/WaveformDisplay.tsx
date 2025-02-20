
import { memo } from "react";
import CardiogramSVG from "../dashboard/CardiogramSVG";

interface WaveformDisplayProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const WaveformDisplay = memo(({ level, color }: WaveformDisplayProps) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="opacity-70 hover:opacity-100 transition-opacity w-[45px]">
        <CardiogramSVG riskLevel={level} color={color} />
      </div>
    </div>
  );
});

WaveformDisplay.displayName = 'WaveformDisplay';

export default WaveformDisplay;
