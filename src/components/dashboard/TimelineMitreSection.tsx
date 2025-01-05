import { Shield } from "lucide-react";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";

interface TimelineMitreSectionProps {
  alert: Alert;
}

const TimelineMitreSection = ({ alert }: TimelineMitreSectionProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-purple-400" />
        <h4 className="text-sm font-medium text-purple-400">MITRE ATT&CK</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-gray-400 mb-2">Tactics</p>
          <div className="flex flex-wrap gap-2">
            {tactics?.split(',').map((tactic, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
              >
                {tactic.trim()}
              </span>
            )) || (
              <span className="text-gray-500 text-xs">No tactics specified</span>
            )}
          </div>
        </div>
        
        <div>
          <p className="text-xs font-medium text-gray-400 mb-2">Techniques</p>
          <div className="flex flex-wrap gap-2">
            {techniques.map((technique, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
              >
                {technique}
              </span>
            ))}
            {techniques.length === 0 && (
              <span className="text-gray-500 text-xs">No techniques specified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineMitreSection;