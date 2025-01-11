import { Shield } from "lucide-react";
import { Alert } from "./types";

interface TimelineMitreSectionProps {
  alert: Alert;
}

const TimelineMitreSection = ({ alert }: TimelineMitreSectionProps) => {
  const tags = alert.tags || ''; // Provide default empty string if tags is undefined
  
  const tactics = tags
    .split(',')
    .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
    .map(tag => tag.replace('attack.', ''))
    .map(tactic => tactic.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '))
    .join(', ');

  const techniques = tags
    .split(',')
    .filter(tag => tag.toLowerCase().includes('t1'))
    .map(tag => tag.trim());
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-purple-400" />
        <h4 className="text-base font-medium text-purple-400">MITRE ATT&CK Analysis</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-2">Tactics Identified</p>
          <div className="flex flex-wrap gap-2">
            {tactics ? tactics.split(',').map((tactic, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full border border-purple-500/20"
              >
                {tactic.trim()}
              </span>
            )) : (
              <span className="text-gray-500 text-sm">No tactics specified</span>
            )}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-400 mb-2">Techniques Observed</p>
          <div className="flex flex-wrap gap-2">
            {techniques.map((technique, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-500/10 text-blue-300 text-sm rounded-full border border-blue-500/20"
              >
                {technique}
              </span>
            ))}
            {techniques.length === 0 && (
              <span className="text-gray-500 text-sm">No techniques specified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineMitreSection;