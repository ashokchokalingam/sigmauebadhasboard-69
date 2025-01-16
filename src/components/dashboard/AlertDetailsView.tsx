import React from 'react';
import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "@/components/ui/card";
import { X, Shield, AlertTriangle, Activity, User, Monitor, Brain } from "lucide-react";
import TimelineRawLog from "./TimelineRawLog";

interface AlertDetailsViewProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetailsView = ({ alert, onClose }: AlertDetailsViewProps) => {
  const browserTime = new Date(alert.system_time).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  const getRiskColor = (risk: number | null) => {
    if (risk === null) return "text-gray-400";
    if (risk >= 80) return "text-red-400";
    if (risk >= 60) return "text-orange-400";
    if (risk >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

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
    <div className="h-full bg-[#1E1E2F]">
      <div className="flex justify-between items-center p-4 border-b border-[#7B68EE]/20 bg-[#1E1E2F] backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
          Alert Details
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#2B2B3B] rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-[#A9A9A9]" />
        </button>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="p-6 space-y-6">
          <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
            <h3 className="text-sm font-medium text-purple-200 mb-2">Description</h3>
            <p className="text-sm text-purple-100/90 leading-relaxed">
              {alert.description || 'No description available'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-purple-200 flex items-center gap-2">
                <Monitor className="h-4 w-4" /> Computer
              </h4>
              <p className="text-sm text-purple-100 font-mono">{alert.computer_name || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-200 flex items-center gap-2">
                <User className="h-4 w-4" /> User Origin
              </h4>
              <p className="text-sm text-purple-100 font-mono">{alert.user_id || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-200 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Rule ID
              </h4>
              <p className="text-sm text-purple-100 font-mono">{alert.ruleid || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-200 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Severity
              </h4>
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-purple-500/10">
                <p className="text-sm font-medium capitalize text-purple-300">
                  {alert.rule_level || 'N/A'}
                </p>
              </div>
            </div>
          </div>

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
            <TimelineRawLog alert={alert} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlertDetailsView;