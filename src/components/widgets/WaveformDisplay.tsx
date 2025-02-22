
import { memo } from "react";
import RiskLevelIndicator from "./RiskLevelIndicator";

interface WaveformDisplayProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const WaveformDisplay = memo(({ level, color }: WaveformDisplayProps) => {
  return (
    <div className="flex items-center gap-1.5">
      <RiskLevelIndicator level={level} textColor={color} />
    </div>
  );
});

WaveformDisplay.displayName = 'WaveformDisplay';

export default WaveformDisplay;
