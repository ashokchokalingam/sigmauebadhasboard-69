import { FileText, AlertTriangle } from "lucide-react";
import { Alert } from "../types";

interface AlertMainInfoProps {
  alert: Alert;
}

const AlertMainInfo = ({ alert }: AlertMainInfoProps) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-400">
        <FileText className="h-5 w-5" />
        <h3 className="text-lg font-medium">Title</h3>
      </div>
      <p className="text-blue-200 pl-7">{alert.title || 'N/A'}</p>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-yellow-400">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="text-lg font-medium">Description</h3>
      </div>
      <p className="text-blue-200 pl-7">{alert.description || 'N/A'}</p>
    </div>
  </div>
);

export default AlertMainInfo;