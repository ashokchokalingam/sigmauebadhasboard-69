import { AlertTriangle, Shield, Hash, Terminal } from "lucide-react";
import { Alert } from "../types";
import DetailField from "./DetailField";
import DetailSection from "./DetailSection";

interface DetailedLogOverviewProps {
  alert: Alert;
}

const DetailedLogOverview = ({ alert }: DetailedLogOverviewProps) => {
  return (
    <DetailSection 
      title="Alert Overview" 
      icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
      className="border-l-4 border-l-yellow-500/50"
    >
      <div className="space-y-4">
        <p className="text-sm text-purple-100/90 leading-relaxed">
          {alert.description || 'No description available'}
        </p>
        <div className="grid grid-cols-3 gap-4 bg-black/20 p-4 rounded-lg">
          <DetailField 
            label="Severity"
            value={alert.rule_level}
            icon={<Shield className="h-4 w-4 text-red-400" />}
            className="text-red-400"
          />
          <DetailField 
            label="Rule ID"
            value={alert.ruleid}
            icon={<Hash className="h-4 w-4 text-blue-400" />}
          />
          <DetailField 
            label="Event ID"
            value={alert.event_id}
            icon={<Terminal className="h-4 w-4 text-green-400" />}
          />
        </div>
      </div>
    </DetailSection>
  );
};

export default DetailedLogOverview;