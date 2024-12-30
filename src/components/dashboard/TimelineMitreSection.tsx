import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";

interface TimelineMitreSectionProps {
  alert: Alert;
}

const TimelineMitreSection = ({ alert }: TimelineMitreSectionProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm font-medium text-blue-400">Tactics</p>
        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
          {tactics || 'N/A'}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-blue-400">Techniques</p>
        <div className="flex flex-col gap-2">
          {techniques.length > 0 ? (
            techniques.map((technique, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-lg border border-purple-500/20 w-fit"
              >
                {technique}
              </span>
            ))
          ) : (
            <span className="text-purple-400">N/A</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineMitreSection;