import { Shield } from "lucide-react";
import { Alert } from "../types";
import DetailSection from "./DetailSection";
import { extractTacticsAndTechniques } from "../utils";

interface DetailedLogMitreProps {
  alert: Alert;
}

const DetailedLogMitre = ({ alert }: DetailedLogMitreProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);

  return (
    <DetailSection 
      title="MITRE ATT&CK" 
      icon={<Shield className="h-4 w-4 text-purple-400" />}
      className="border-l-4 border-l-purple-500/50"
    >
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-purple-400 mb-2">Tactics</h4>
          <div className="flex flex-wrap gap-2">
            {tactics?.split(',').map((tactic, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-[#9b87f5]/10 text-[#9b87f5] text-sm rounded-full border border-[#9b87f5]/20"
              >
                {tactic.trim()}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-purple-400 mb-2">Techniques</h4>
          <div className="flex flex-wrap gap-2">
            {techniques.map((technique, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-[#F97316]/10 text-[#F97316] text-sm rounded-full border border-[#F97316]/20"
              >
                {technique}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DetailSection>
  );
};

export default DetailedLogMitre;