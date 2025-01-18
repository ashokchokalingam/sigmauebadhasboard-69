import { Alert } from "../types";
import { ScrollArea } from "../../ui/scroll-area";
import MetadataGrid from "./MetadataGrid";

interface DetailsPanelProps {
  alert: Alert;
  onClose: () => void;
  formatTime: (timeString: string) => string;
}

const DetailsPanel = ({ alert, onClose, formatTime }: DetailsPanelProps) => {
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
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C]">
      <div className="flex-none bg-[#1E1E2F] p-6 border-b border-purple-400/20">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-purple-100">
            {alert.title || 'N/A'}
          </h2>
          <button 
            onClick={onClose}
            className="text-purple-300 hover:text-purple-100 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
            <h3 className="text-sm font-medium text-purple-200 mb-2">Description</h3>
            <p className="text-sm text-purple-100/90 leading-relaxed">
              {alert.description || 'No description available'}
            </p>
          </div>

          <MetadataGrid alert={alert} formatTime={formatTime} />

          <div className="space-y-4">
            <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
              <h3 className="text-sm font-medium text-purple-200 mb-2">MITRE Tactics</h3>
              <div className="flex flex-wrap gap-2">
                {tactics && tactics.length > 0 ? tactics.map((tactic, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                  >
                    {tactic.trim()}
                  </span>
                )) : (
                  <span className="text-purple-300/50">No tactics identified</span>
                )}
              </div>
            </div>

            <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
              <h3 className="text-sm font-medium text-purple-200 mb-2">MITRE Techniques</h3>
              <div className="flex flex-wrap gap-2">
                {techniques && techniques.length > 0 ? techniques.map((technique, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                  >
                    {technique.trim()}
                  </span>
                )) : (
                  <span className="text-purple-300/50">No techniques identified</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
            <h3 className="text-sm font-medium text-purple-200 mb-2">Raw Data</h3>
            <pre className="text-xs text-purple-100/90 bg-[#1A1F2C] p-4 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
              {typeof alert.raw === 'string' 
                ? JSON.stringify(JSON.parse(alert.raw), null, 2)
                : JSON.stringify(alert.raw, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPanel;