
import { extractTacticsAndTechniques } from "./utils";
import WaveformDisplay from "../widgets/WaveformDisplay";
import RiskScoreDisplay from "../widgets/RiskScoreDisplay";

interface RiskIndicatorsProps {
  level: string;
  color: string;
  textColor: string;
  lineColor: string;
  barWidth: number;
  glowColor: string;
  riskScore: number;
  tags?: string;
}

const RiskIndicators = ({ 
  level,
  color,
  textColor,
  lineColor,
  barWidth,
  glowColor,
  riskScore,
  tags = ''
}: RiskIndicatorsProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(tags);
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col items-start mr-1">
        <span className="text-[11px] uppercase text-[#9b87f5]/60">Risk Level</span>
        <span className={`text-sm font-medium tracking-wider uppercase ${textColor}`}>
          {level}
        </span>
      </div>

      <div className="flex items-center">
        <div className="opacity-70 hover:opacity-100 transition-opacity w-[32px]">
          <WaveformDisplay 
            level={level as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} 
            color={color} 
          />
        </div>

        <RiskScoreDisplay 
          score={riskScore}
          textColor={textColor}
          lineColor={lineColor}
          barWidth={barWidth}
          glowColor={glowColor}
          color={color}
          tactics={tactics}
          techniques={techniques}
        />
      </div>
    </div>
  );
};

export default RiskIndicators;
