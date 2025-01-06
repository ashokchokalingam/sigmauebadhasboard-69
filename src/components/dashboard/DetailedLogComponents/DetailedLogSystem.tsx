import { Monitor, Network, Terminal, FileText } from "lucide-react";
import { Alert } from "../types";
import DetailField from "./DetailField";
import DetailSection from "./DetailSection";

interface DetailedLogSystemProps {
  alert: Alert;
}

const DetailedLogSystem = ({ alert }: DetailedLogSystemProps) => {
  return (
    <DetailSection 
      title="System Information" 
      icon={<Monitor className="h-4 w-4 text-blue-400" />}
      className="border-l-4 border-l-blue-500/50"
    >
      <div className="grid grid-cols-2 gap-4">
        <DetailField 
          label="Computer"
          value={alert.computer_name}
          icon={<Monitor className="h-4 w-4" />}
        />
        <DetailField 
          label="IP Address"
          value={alert.ip_address}
          icon={<Network className="h-4 w-4" />}
        />
        <DetailField 
          label="Provider"
          value={alert.provider_name}
          icon={<Terminal className="h-4 w-4" />}
        />
        <DetailField 
          label="Task"
          value={alert.task}
          icon={<FileText className="h-4 w-4" />}
        />
      </div>
    </DetailSection>
  );
};

export default DetailedLogSystem;