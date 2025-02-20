
import { FileText, AlignLeft, Server, Activity, Shield, Tag, AlertTriangle } from "lucide-react";
import { Alert } from "../types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/utils/dateTimeUtils";
import { UserCell } from "./cells/UserCell";
import { ComputerCell } from "./cells/ComputerCell";
import { IPAddressCell } from "./cells/IPAddressCell";
import { getRiskBadgeColor, getRiskLabel } from "./utils/riskUtils";

interface TableCellProps {
  alert: Alert;
  columnKey: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const TableCell = ({ alert, columnKey, onTimelineView }: TableCellProps) => {
  switch (columnKey) {
    case 'system_time':
      const formattedTime = formatDateTime(alert.system_time, false);
      return (
        <span className="text-base font-medium whitespace-nowrap">
          {typeof formattedTime === 'string' ? formattedTime : formattedTime.local}
        </span>
      );
    case 'user_id':
      return <UserCell userId={alert.user_id || ''} onTimelineView={onTimelineView} />;
    case 'target_user_name':
      return <UserCell userId={alert.target_user_name || ''} onTimelineView={onTimelineView} />;
    case 'computer_name':
      return <ComputerCell computerName={alert.computer_name || ''} onTimelineView={onTimelineView} />;
    case 'ip_address':
      return <IPAddressCell ipAddress={alert.ip_address || ''} />;
    case 'risk':
      return (
        <Badge 
          variant="outline" 
          className={`${getRiskBadgeColor(alert.risk)} border-none px-4 py-1.5 shadow-sm`}
        >
          {getRiskLabel(alert.risk)}
        </Badge>
      );
    case 'title':
      return (
        <div className="flex items-center min-w-0">
          <FileText className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base font-medium whitespace-nowrap">{alert.title}</span>
        </div>
      );
    case 'description':
      return (
        <div className="flex items-center min-w-0">
          <AlignLeft className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base whitespace-nowrap">{alert.description}</span>
        </div>
      );
    case 'event_id':
      return (
        <div className="flex items-center min-w-0">
          <Server className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="text-base font-medium whitespace-nowrap">{alert.event_id || '-'}</span>
        </div>
      );
    case 'provider_name':
      return (
        <div className="flex items-center min-w-0">
          <Server className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base whitespace-nowrap">{alert.provider_name || '-'}</span>
        </div>
      );
    case 'ruleid':
      return (
        <div className="flex items-center min-w-0">
          <Shield className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base font-medium whitespace-nowrap">{alert.ruleid || '-'}</span>
        </div>
      );
    case 'rule_level':
      return (
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-blue-400/80 flex-shrink-0" />
          <Badge 
            variant="outline" 
            className="bg-blue-500/10 text-blue-300 border-blue-500/20 px-3 py-1"
          >
            {alert.rule_level || 'Unknown'}
          </Badge>
        </div>
      );
    case 'task':
      return (
        <div className="flex items-center min-w-0">
          <Activity className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base whitespace-nowrap">{alert.task || '-'}</span>
        </div>
      );
    case 'target_domain_name':
      return (
        <div className="flex items-center min-w-0">
          <Server className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base whitespace-nowrap">{alert.target_domain_name || '-'}</span>
        </div>
      );
    case 'tactics':
      return (
        <div className="flex items-center min-w-0">
          <Shield className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base whitespace-nowrap">{alert.tactics || '-'}</span>
        </div>
      );
    case 'techniques':
      return (
        <div className="flex items-center min-w-0">
          <Shield className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base whitespace-nowrap">{alert.techniques || '-'}</span>
        </div>
      );
    case 'ml_description':
      return (
        <div className="flex items-center min-w-0">
          <AlignLeft className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base whitespace-nowrap">{alert.ml_description || '-'}</span>
        </div>
      );
    case 'ml_cluster':
      return (
        <div className="flex items-center min-w-0">
          <Activity className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="text-base font-medium whitespace-nowrap">
            {alert.ml_cluster === -1 ? "Noise" : `Cluster ${alert.ml_cluster}`}
          </span>
        </div>
      );
    case 'tags':
      return (
        <div className="flex items-center min-w-0">
          <Tag className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base whitespace-nowrap">{alert.tags || '-'}</span>
        </div>
      );
    default:
      return (
        <span className="text-base font-medium whitespace-nowrap">
          {String(alert[columnKey as keyof Alert] || '-')}
        </span>
      );
  }
};

export default TableCell;
