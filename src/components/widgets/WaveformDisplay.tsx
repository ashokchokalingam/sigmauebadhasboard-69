
import RiskSparkline from "@/components/dashboard/RiskSparkline";

interface WaveformDisplayProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const WaveformDisplay = ({ level, color }: WaveformDisplayProps) => {
  return <RiskSparkline riskLevel={level} color={color} />;
};

export default WaveformDisplay;
