import { Shield } from "lucide-react";
import { Alert } from "./types";

interface TimelineMitreSectionProps {
  alert: Alert;
}

const TimelineMitreSection = ({ alert }: TimelineMitreSectionProps) => {
  const tactics = alert.tags?.split(',')
    .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
    .map(tag => tag.replace('attack.', ''))
    .map(tactic => tactic.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '));

  const techniques = alert.tags?.split(',')
    .filter(tag => tag.toLowerCase().includes('t1'))
    .map(tag => tag.trim().toUpperCase());

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-purple-400" />
        <h4 className="text-base font-medium text-purple-400">MITRE ATT&CK Analysis</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h5 className="text-sm font-medium text-purple-300">Tactics:</h5>
          <div className="flex flex-wrap gap-2 mt-1">
            {tactics?.map((tactic, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full border border-purple-500/20"
              >
                {tactic}
              </span>
            )) || (
              <span className="text-gray-500 text-sm">No tactics specified</span>
            )}
          </div>
        </div>
        
        <div>
          <h5 className="text-sm font-medium text-purple-300">Techniques:</h5>
          <div className="flex flex-wrap gap-2 mt-1">
            {techniques?.map((technique, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-500/10 text-blue-300 text-sm rounded-full border border-blue-500/20"
              >
                {technique}
              </span>
            ))}
            {(!techniques || techniques.length === 0) && (
              <span className="text-gray-500 text-sm">No techniques specified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineMitreSection;