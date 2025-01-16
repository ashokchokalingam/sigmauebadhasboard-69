import React from 'react';
import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "@/components/ui/card";
import { X, Shield, AlertTriangle, Activity, User, Monitor, Brain } from "lucide-react";

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

  return (
    <div className="h-full bg-[#1E1E2F] relative">
      <div className="flex justify-between items-center p-4 border-b border-[#7B68EE]/20 bg-[#1E1E2F] backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
          Event Details
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
              <p className="text-sm text-purple-100">{alert.computer_name || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-200 flex items-center gap-2">
                <User className="h-4 w-4" /> User
              </h4>
              <p className="text-sm text-purple-100">{alert.user_id || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-200 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Rule ID
              </h4>
              <p className="text-sm text-purple-100">{alert.ruleid || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-200 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Severity
              </h4>
              <p className="text-sm text-purple-100 capitalize">{alert.rule_level || 'N/A'}</p>
            </div>
          </div>

          {alert.raw && (
            <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
              <h3 className="text-sm font-medium text-purple-200 mb-2">Raw Data</h3>
              <pre className="text-xs text-purple-100/90 whitespace-pre-wrap break-all">
                {typeof alert.raw === 'string' ? alert.raw : JSON.stringify(alert.raw, null, 2)}
              </pre>
            </div>
          )}

          {alert.tags && (
            <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
              <h3 className="text-sm font-medium text-purple-200 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {alert.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlertDetailsView;