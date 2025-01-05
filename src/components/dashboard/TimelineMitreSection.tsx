import { Shield } from "lucide-react";
import { Alert } from "./types";

interface TimelineMitreSectionProps {
  alert: Alert;
}

const TimelineMitreSection = ({ alert }: TimelineMitreSectionProps) => {
  return (
    <div className="mt-6 text-center">
      <div className="inline-flex items-center gap-2 text-lg font-medium text-blue-300 mb-4">
        <Shield className="h-5 w-5" />
        <span>MITRE ATT&CK Details</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {alert.mitre_tactics && (
          <div className="p-4 rounded-lg bg-blue-950/30 border border-blue-500/10">
            <h4 className="text-lg font-medium text-blue-200 mb-3">Tactics</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {alert.mitre_tactics.map((tactic, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20"
                >
                  {tactic}
                </span>
              ))}
            </div>
          </div>
        )}

        {alert.mitre_techniques && (
          <div className="p-4 rounded-lg bg-purple-950/30 border border-purple-500/10">
            <h4 className="text-lg font-medium text-purple-200 mb-3">Techniques</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {alert.mitre_techniques.map((technique, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20"
                >
                  {technique}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineMitreSection;