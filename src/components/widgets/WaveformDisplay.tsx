
import SignalStrengthBars from "@/components/dashboard/SignalStrengthBars";

interface WaveformDisplayProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const WaveformDisplay = ({ level, color }: WaveformDisplayProps) => {
  return <SignalStrengthBars riskLevel={level} color={color} />;
};

export default WaveformDisplay;
