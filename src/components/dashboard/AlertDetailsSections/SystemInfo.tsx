import { Card } from "@/components/ui/card";
import { Alert } from "../types";

interface SystemInfoProps {
  alert: Alert;
  browserTime: string;
}

const SystemInfo = ({ alert, browserTime }: SystemInfoProps) => {
  return (
    <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
      <h3 className="text-lg font-semibold text-[#E0E0E0] mb-3">System Information</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">Computer Name</h4>
          <p className="text-sm text-[#E0E0E0] font-mono">{alert.computer_name || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">IP Address</h4>
          <p className="text-sm text-[#E0E0E0] font-mono">{alert.ip_address || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">User ID</h4>
          <p className="text-sm text-[#E0E0E0] font-mono">{alert.user_id || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">Event ID</h4>
          <p className="text-sm text-[#1E90FF] font-mono">{alert.event_id || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">Provider</h4>
          <p className="text-sm text-[#E0E0E0] font-mono">{alert.provider_name || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">Target User</h4>
          <p className="text-sm text-[#1E90FF] font-mono">{alert.target_user_name || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">User Impacted</h4>
          <p className="text-sm text-[#1E90FF] font-mono">{alert.user_impacted || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">Target Domain</h4>
          <p className="text-sm text-[#E0E0E0] font-mono">{alert.target_domain_name || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9]">System Time</h4>
          <p className="text-sm text-[#E0E0E0] font-mono">{browserTime || 'N/A'}</p>
        </div>
      </div>
    </Card>
  );
};

export default SystemInfo;