
import RiskLevelIndicator from "@/components/widgets/RiskLevelIndicator";

interface WaveformDisplayProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const WaveformDisplay = ({ level, color }: WaveformDisplayProps) => {
  return <RiskLevelIndicator level={level} textColor={color} />;
};

export default WaveformDisplay;
