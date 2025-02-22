
import RiskScoreDisplay from "../widgets/RiskScoreDisplay";

interface RiskIndicatorsProps {
  level: string;
  textColor: string;
  riskScore: number;
}

const RiskIndicators = ({ 
  level,
  textColor,
  riskScore
}: RiskIndicatorsProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col items-start mr-1">
        <span className="text-[11px] uppercase text-[#9b87f5]/60">Risk Level</span>
        <span className={`text-sm font-medium tracking-wider uppercase ${textColor}`}>
          {level}
        </span>
      </div>

      <div className="flex items-center">
        <RiskScoreDisplay 
          score={riskScore}
          textColor={textColor}
        />
      </div>
    </div>
  );
};

export default RiskIndicators;
