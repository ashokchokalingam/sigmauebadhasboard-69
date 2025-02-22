
import RiskMeter from "@/components/dashboard/RiskMeter";

interface WaveformDisplayProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const WaveformDisplay = ({ level, color }: WaveformDisplayProps) => {
  return <RiskMeter riskLevel={level} color={color} />;
};

export default WaveformDisplay;
