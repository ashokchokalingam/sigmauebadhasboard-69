import React from 'react';
import { Alert } from "./types";
import TimelineRawLog from "./TimelineRawLog";
import { Card } from "@/components/ui/card";
import { X, Monitor, User, Hash, Shield, Clock, Globe, Database } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const getSeverityColor = (level: string = '') => {
    const l = level.toLowerCase();
    if (l.includes('critical')) return 'text-red-400';
    if (l.includes('high')) return 'text-orange-400';
    if (l.includes('medium')) return 'text-yellow-400';
    if (l.includes('low')) return 'text-green-400';
    return 'text-blue-400';
  };

  return (
    <div className="h-full bg-[#1E1E2F] border-l border-purple-500/20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#1E1E2F]/95 backdrop-blur-sm p-6 border-b border-purple-500/20">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-purple-100">
            {alert.title || 'N/A'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-purple-300 hover:text-purple-100" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-5rem)]">
        {/* Description */}
        <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-sm font-medium text-purple-200 mb-2">Description</h3>
          <p className="text-sm text-purple-100/90 leading-relaxed">
            {alert.description || 'No description available'}
          </p>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-400">Computer</p>
                <p className="text-sm text-blue-100 font-mono">{alert.computer_name || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-400">User Origin</p>
                <p className="text-sm text-blue-100 font-mono">{alert.user_id || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-400">Event ID</p>
                <p className="text-sm text-blue-100 font-mono">{alert.event_id || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-400">Rule ID</p>
                <p className="text-sm text-blue-100 font-mono">{alert.ruleid || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-400">System Time</p>
                <p className="text-sm text-blue-100 font-mono">{browserTime}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-400">Target Domain</p>
                <p className="text-sm text-blue-100 font-mono">{alert.target_domain_name || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-400">ML Cluster</p>
                <p className="text-sm text-blue-100 font-mono">{alert.ml_cluster || 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-blue-400">Severity</p>
              <p className={cn("text-sm font-medium", getSeverityColor(alert.rule_level))}>
                {alert.rule_level || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* MITRE ATT&CK Section */}
        <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-sm font-medium text-purple-200 mb-4">MITRE ATT&CK</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-purple-300 mb-2">Tactics</h4>
              <div className="flex flex-wrap gap-2">
                {alert.tags?.split(',')
                  .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
                  .map((tactic, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                    >
                      {tactic.replace('attack.', '').split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-purple-300 mb-2">Techniques</h4>
              <div className="flex flex-wrap gap-2">
                {alert.tags?.split(',')
                  .filter(tag => tag.toLowerCase().includes('t1'))
                  .map((technique, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                    >
                      {technique.trim()}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Raw Log Section */}
        <Card className="bg-[#1A1F2C] border-purple-500/20">
          <TimelineRawLog alert={alert} />
        </Card>
      </div>
    </div>
  );
};

export default AlertDetailsView;