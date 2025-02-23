
import { Shield } from "lucide-react";

interface TimelineMitreSectionProps {
  tactics: string[];
  techniques: string[];
}

const TimelineMitreSection = ({ tactics, techniques }: TimelineMitreSectionProps) => {
  if (!tactics.length && !techniques.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-purple-400" />
        <h4 className="text-base font-medium text-purple-400">MITRE ATT&CK Analysis</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-2">Tactics Identified</p>
          <div className="flex flex-wrap gap-2">
            {tactics
              .filter(tactic => tactic.includes('attack.') && !tactic.toLowerCase().includes('t1'))
              .map((tactic, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-purple-500/10 text-purple-300 text-sm rounded-full 
                    border border-purple-500/20"
                >
                  {tactic.replace('attack.', '').split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-400 mb-2">Techniques Observed</p>
          <div className="flex flex-wrap gap-2">
            {techniques
              .filter(technique => technique.toLowerCase().includes('t1'))
              .map((technique, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-sm rounded-full 
                    border border-blue-500/20"
                >
                  {technique.trim()}
                </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineMitreSection;
