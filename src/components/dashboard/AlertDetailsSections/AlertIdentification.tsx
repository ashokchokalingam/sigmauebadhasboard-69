import { Card } from "@/components/ui/card";
import { Alert } from "../types";

interface AlertIdentificationProps {
  alert: Alert;
}

const AlertIdentification = ({ alert }: AlertIdentificationProps) => {
  const getSeverityColor = (level: string = '') => {
    const l = level.toLowerCase();
    if (l.includes('critical')) return 'text-[#FF4500]';
    if (l.includes('high')) return 'text-[#FF8C00]';
    if (l.includes('medium')) return 'text-[#FFD700]';
    if (l.includes('low')) return 'text-[#32CD32]';
    return 'text-[#1E90FF]';
  };

  return (
    <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
      <h3 className="text-lg font-semibold text-[#E0E0E0] mb-3">Alert Overview</h3>
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">Title</h4>
          <p className="text-lg text-white">{alert.title || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">Description</h4>
          <p className="text-sm text-[#E0E0E0]">{alert.description || 'N/A'}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <h4 className="text-sm font-medium text-[#A9A9A9]">Severity</h4>
            <p className={`text-sm ${getSeverityColor(alert.rule_level)}`}>
              {alert.rule_level || 'N/A'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#A9A9A9]">Rule ID</h4>
            <p className="text-sm text-[#1E90FF] font-mono">{alert.ruleid || 'N/A'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#A9A9A9]">Task</h4>
            <p className="text-sm text-white">{alert.task || 'N/A'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AlertIdentification;