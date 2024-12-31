import { Hash } from "lucide-react";
import { Alert } from "../types";

interface AlertIdentificationProps {
  alert: Alert;
}

const AlertIdentification = ({ alert }: AlertIdentificationProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 text-blue-400">
      <Hash className="h-5 w-5" />
      <h3 className="text-lg font-medium">Alert ID</h3>
    </div>
    <p className="text-blue-200 pl-7 font-mono">{alert.id || 'N/A'}</p>
  </div>
);

export default AlertIdentification;