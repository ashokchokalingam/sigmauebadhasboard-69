
import { Card } from "@/components/ui/card";
import { Alert } from "../types";
import { getSeverityColor } from "../utils";
import { User, Hash, FileCode, Network, AlertTriangle, Clock, Globe, Brain, Fingerprint, Server } from "lucide-react";

interface AlertMetadataProps {
  alert: Alert;
  browserTime: string;
}

const AlertMetadata = ({ alert, browserTime }: AlertMetadataProps) => {
  return (
    <Card className="bg-gradient-to-br from-[#1E1E2F] to-[#2B2B3B] border-[#7B68EE]/20 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center gap-2">
        <FileCode className="h-5 w-5 text-indigo-400" />
        Event Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="space-y-4">
          <div className="group p-3 rounded-lg bg-[#1E1E2F]/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <h4 className="text-sm font-medium text-indigo-300/70 mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-400" />
              User Origin
            </h4>
            <p className="text-sm text-[#E0E0E0] font-mono bg-black/20 px-3 py-1.5 rounded">{alert.user_id || 'N/A'}</p>
          </div>

          <div className="group p-3 rounded-lg bg-[#1E1E2F]/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <h4 className="text-sm font-medium text-indigo-300/70 mb-2 flex items-center gap-2">
              <Hash className="h-4 w-4 text-indigo-400" />
              Event ID
            </h4>
            <p className="text-sm text-[#E0E0E0] font-mono bg-black/20 px-3 py-1.5 rounded">{alert.event_id || 'N/A'}</p>
          </div>

          <div className="group p-3 rounded-lg bg-[#1E1E2F]/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <h4 className="text-sm font-medium text-indigo-300/70 mb-2 flex items-center gap-2">
              <FileCode className="h-4 w-4 text-indigo-400" />
              Task
            </h4>
            <p className="text-sm text-[#E0E0E0] font-mono bg-black/20 px-3 py-1.5 rounded">{alert.task || 'N/A'}</p>
          </div>

          <div className="group p-3 rounded-lg bg-[#1E1E2F]/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <h4 className="text-sm font-medium text-indigo-300/70 mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-400" />
              ML Cluster
            </h4>
            <p className="text-sm text-[#E0E0E0] font-mono bg-black/20 px-3 py-1.5 rounded">{alert.ml_cluster || 'N/A'}</p>
          </div>

          <div className="group p-3 rounded-lg bg-[#1E1E2F]/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <h4 className="text-sm font-medium text-indigo-300/70 mb-2 flex items-center gap-2">
              <Network className="h-4 w-4 text-indigo-400" />
              IP Address
            </h4>
            <p className="text-sm text-[#E0E0E0] font-mono bg-black/20 px-3 py-1.5 rounded">{alert.ip_address || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="group p-3 rounded-lg bg-[#1E1E2F]/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <h4 className="text-sm font-medium text-indigo-300/70 mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-400" />
              User Impacted
            </h4>
            <p className="text-sm text-[#E0E0E0] font-mono bg-black/20 px-3 py-1.5 rounded">{alert.target_user_name || 'N/A'}</p>
          </div>

          <div className="group p-3 rounded-lg bg-[#1E1E2F]/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <h4 className="text-sm font-medium text-indigo-300/70 mb-2 flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-400" />
              Provider Name
            </h4>
            <p className="text-sm text-[#E0E0E0] font-mono bg-black/20 px-3 py-1.5 rounded">{alert.provider_name || 'N/A'}</p>
          </div>

          <div className="group p-3 rounded-lg bg-[#1E1E2F]/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <h4 className="text-sm font-medium text-indigo-300/70 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-indigo-400" />
              Severity
            </h4>
            <p className={`text-sm font-mono px-3 py-1.5 rounded bg-black/20 ${getSeverityColor(alert.rule_level || '')}`}>
              {alert.rule_level || 'N/A'}
            </p>
          </div>

          <div className="group p-3 rounded-lg bg-[#1E1E2F]/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <h4 className="text-sm font-medium text-indigo-300/70 mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              System Time
            </h4>
            <p className="text-sm text-[#E0E0E0] font-mono bg-black/20 px-3 py-1.5 rounded">{browserTime}</p>
          </div>

          <div className="group p-3 rounded-lg bg-[#1E1E2F]/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <h4 className="text-sm font-medium text-indigo-300/70 mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-400" />
              Target Domain
            </h4>
            <p className="text-sm text-[#E0E0E0] font-mono bg-black/20 px-3 py-1.5 rounded">{alert.target_domain_name || 'N/A'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AlertMetadata;
