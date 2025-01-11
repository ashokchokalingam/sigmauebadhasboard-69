import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Alert } from "./types";
import { ZoomIn, ZoomOut } from "lucide-react";

interface MitreAttackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: Alert[];
}

const MitreAttackModal = ({ open, onOpenChange, events }: MitreAttackModalProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const tactics = [
    'Reconnaissance',
    'Resource Development',
    'Initial Access',
    'Execution',
    'Persistence',
    'Privilege Escalation',
    'Defense Evasion',
    'Credential Access',
    'Discovery',
    'Lateral Movement',
    'Collection',
    'Command And Control',
    'Exfiltration',
    'Impact'
  ];

  const getTacticColor = (tactic: string) => {
    const colors: { [key: string]: string } = {
      'Reconnaissance': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      'Resource Development': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      'Initial Access': 'from-red-500/20 to-red-600/20 border-red-500/30',
      'Execution': 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
      'Persistence': 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
      'Privilege Escalation': 'from-green-500/20 to-green-600/20 border-green-500/30',
      'Defense Evasion': 'from-teal-500/20 to-teal-600/20 border-teal-500/30',
      'Credential Access': 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
      'Discovery': 'from-sky-500/20 to-sky-600/20 border-sky-500/30',
      'Lateral Movement': 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30',
      'Collection': 'from-violet-500/20 to-violet-600/20 border-violet-500/30',
      'Command And Control': 'from-fuchsia-500/20 to-fuchsia-600/20 border-fuchsia-500/30',
      'Exfiltration': 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
      'Impact': 'from-rose-500/20 to-rose-600/20 border-rose-500/30'
    };
    return colors[tactic] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
  };

  const getEventColor = (ruleLevel: string | undefined) => {
    switch (ruleLevel?.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/90';
      case 'high':
        return 'bg-orange-500/90';
      case 'medium':
        return 'bg-yellow-500/90';
      default:
        return 'bg-green-500/90';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] w-screen h-screen p-0 bg-gradient-to-br from-gray-900 to-gray-950 border-none">
        <div className="h-full flex flex-col p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              MITRE ATT&CK Timeline
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ZoomOut className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ZoomIn className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <div className="min-w-[800px]" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
              {tactics.map(tactic => (
                <div key={tactic} className="group">
                  <div className={`grid grid-cols-[200px,1fr] gap-4 border-b border-gray-800 py-3 hover:bg-gradient-to-r ${getTacticColor(tactic)}`}>
                    <div className="text-sm font-medium text-gray-300 pl-4 group-hover:text-white transition-colors">
                      {tactic}
                    </div>
                    <div className="relative h-8">
                      {events
                        .filter(event => event.tags?.toLowerCase().includes(tactic.toLowerCase()))
                        .map((event, index) => (
                          <div
                            key={`${event.id}-${index}`}
                            className={`absolute top-1/2 -translate-y-1/2 h-6 px-3 rounded-full flex items-center justify-center 
                              ${getEventColor(event.rule_level)} text-white text-xs cursor-pointer transform hover:scale-105 
                              transition-all duration-300 whitespace-nowrap overflow-hidden shadow-lg hover:shadow-xl
                              backdrop-blur-sm`}
                            style={{
                              left: `${(new Date(event.system_time).getHours() - 12) * 100}px`,
                              minWidth: '150px'
                            }}
                            onClick={() => window.open('https://attack.mitre.org/', '_blank')}
                          >
                            {event.title}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[200px,1fr] gap-4 mt-4 border-t border-gray-800 pt-4">
                <div></div>
                <div className="flex justify-between text-xs text-gray-500">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i}>{13 + i}:00</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MitreAttackModal;