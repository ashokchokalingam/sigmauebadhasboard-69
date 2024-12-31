import { Alert } from "../types";

interface MitreInfoProps {
  alert: Alert;
}

const MitreInfo = ({ alert }: MitreInfoProps) => {
  const tactics = alert.tags?.split(',')
    .filter(tag => tag.includes('attack.'))
    .map(tag => tag.replace('attack.', ''))
    .join(', ');

  const techniques = alert.tags?.split(',')
    .filter(tag => tag.toLowerCase().includes('t1'))
    .map(tag => tag.trim().toUpperCase());

  return (
    <div className="space-y-4 pl-7">
      <h4 className="text-lg font-medium text-purple-400">MITRE ATT&CK</h4>
      
      <div className="space-y-4">
        <div>
          <h5 className="text-sm font-medium text-purple-300">Tactics:</h5>
          <p className="text-purple-200 mt-1">{tactics || 'N/A'}</p>
        </div>
        
        <div>
          <h5 className="text-sm font-medium text-purple-300">Techniques:</h5>
          <div className="flex flex-wrap gap-2 mt-1">
            {techniques?.map((technique, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full border border-purple-500/20"
              >
                {technique}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitreInfo;