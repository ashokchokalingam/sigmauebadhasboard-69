import { Shield } from "lucide-react";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";

interface TimelineMitreSectionProps {
  alert: Alert;
}

const TimelineMitreSection = ({ alert }: TimelineMitreSectionProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-3 w-3 text-purple-400" />
        <h4 className="text-xs font-medium text-purple-400">MITRE ATT&CK</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] font-medium text-gray-400 mb-1">Tactics</p>
          <div className="flex flex-wrap gap-1">
            {tactics?.split(',').map((tactic, index) => (
              <span 
                key={index}
                className="px-1.5 py-0.5 bg-purple-500/10 text-purple-300 text-[10px] rounded-full border border-purple-500/20"
              >
                {tactic.trim()}
              </span>
            )) || (
              <span className="text-gray-500 text-[10px]">No tactics specified</span>
            )}
          </div>
        </div>
        
        <div>
          <p className="text-[10px] font-medium text-gray-400 mb-1">Techniques</p>
          <div className="flex flex-wrap gap-1">
            {techniques.map((technique, index) => (
              <span 
                key={index}
                className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300 text-[10px] rounded-full border border-blue-500/20"
              >
                {technique}
              </span>
            ))}
            {techniques.length === 0 && (
              <span className="text-gray-500 text-[10px]">No techniques specified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineMitreSection;