import { cn } from "@/lib/utils";
import EntityCardInfo from "./EntityCardInfo";
import EntityCardRiskIndicator from "./EntityCardRiskIndicator";

interface EntityCardProps {
  id: string | null;
  eventCount?: number | null;
  uniqueTitles?: number | null;
  onClick: () => void;
  riskScore?: string | null;
}

const EntityCard = ({ id, uniqueTitles = 0, onClick, riskScore }: EntityCardProps) => {
  const isComputer = id?.endsWith('$') ?? false;

  const getRiskLevel = (score: string | null) => {
    if (!score) return "";
    const numScore = parseInt(score);
    if (numScore >= 200) return "critical";
    if (numScore >= 50) return "high";
    return "low";
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex items-center p-3 rounded-lg",
        "transition-all duration-300 cursor-pointer",
        "bg-[#0D0E12] hover:bg-[#15161E]",
        "border border-blue-500/10 hover:border-blue-500/20"
      )}
    >
      <EntityCardInfo
        id={id}
        isComputer={isComputer}
        uniqueTitles={uniqueTitles}
      />

      {riskScore && (
        <div className="flex-1 flex items-center justify-end">
          <EntityCardRiskIndicator
            riskScore={riskScore}
            riskLevel={getRiskLevel(riskScore)}
          />
        </div>
      )}
    </div>
  );
};

export default EntityCard;