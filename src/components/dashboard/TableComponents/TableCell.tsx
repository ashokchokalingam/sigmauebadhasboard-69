import { Monitor, FileText, AlignLeft, User, Hash, Server, Activity, Shield, Tag, Network, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Alert } from "../types";

interface TableCellProps {
  alert: Alert;
  columnKey: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const TableCell = ({ alert, columnKey, onTimelineView }: TableCellProps) => {
  switch (columnKey) {
    case 'system_time':
      return (
        <span className="text-base font-medium">
          {format(new Date(alert.system_time), "MMM dd, yyyy, hh:mm:ss aa")}
        </span>
      );
    case 'user_id':
      return (
        <div className="flex items-center">
          <User className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span 
            className="hover:text-blue-400 cursor-pointer truncate text-base font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("user", alert.user_id || '');
            }}
          >
            {alert.user_id || '-'}
          </span>
        </div>
      );
    case 'target_user_name':
      return (
        <div className="flex items-center">
          <User className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span 
            className="hover:text-blue-400 cursor-pointer truncate text-base font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("user", alert.target_user_name || '');
            }}
          >
            {alert.target_user_name || '-'}
          </span>
        </div>
      );
    case 'computer_name':
      return (
        <div className="flex items-center">
          <Monitor className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span 
            className="hover:text-blue-400 cursor-pointer truncate text-base font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("computer", alert.computer_name || '');
            }}
          >
            {alert.computer_name || '-'}
          </span>
        </div>
      );
    case 'title':
      return (
        <div className="flex items-center">
          <FileText className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base font-medium">{alert.title}</span>
        </div>
      );
    case 'description':
      return (
        <div className="flex items-center">
          <AlignLeft className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base">{alert.description}</span>
        </div>
      );
    case 'event_id':
      return (
        <div className="flex items-center">
          <Hash className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="text-base font-medium">{alert.event_id || '-'}</span>
        </div>
      );
    case 'provider_name':
      return (
        <div className="flex items-center">
          <Server className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base">{alert.provider_name || '-'}</span>
        </div>
      );
    case 'ip_address':
      return (
        <div className="flex items-center">
          <Network className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="text-base font-medium">{alert.ip_address || '-'}</span>
        </div>
      );
    case 'ruleid':
      return (
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base font-medium">{alert.ruleid || '-'}</span>
        </div>
      );
    case 'rule_level':
      return (
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="text-base font-medium capitalize">{alert.rule_level || '-'}</span>
        </div>
      );
    case 'task':
      return (
        <div className="flex items-center">
          <Activity className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base">{alert.task || '-'}</span>
        </div>
      );
    case 'target_domain_name':
      return (
        <div className="flex items-center">
          <Server className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base">{alert.target_domain_name || '-'}</span>
        </div>
      );
    case 'tactics':
      return (
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base">{alert.tactics || '-'}</span>
        </div>
      );
    case 'techniques':
      return (
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base">{alert.techniques || '-'}</span>
        </div>
      );
    case 'ml_description':
      return (
        <div className="flex items-center">
          <AlignLeft className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base">{alert.ml_description || '-'}</span>
        </div>
      );
    case 'ml_cluster':
      return (
        <div className="flex items-center">
          <Activity className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="text-base font-medium">
            {alert.ml_cluster === -1 ? "Noise" : `Cluster ${alert.ml_cluster}`}
          </span>
        </div>
      );
    case 'risk':
      return (
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="text-base font-medium">{alert.risk || '-'}</span>
        </div>
      );
    case 'tags':
      return (
        <div className="flex items-center">
          <Tag className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate text-base">{alert.tags || '-'}</span>
        </div>
      );
    default:
      return (
        <span className="text-base font-medium">
          {String(alert[columnKey as keyof Alert] || '-')}
        </span>
      );
  }
};

export default TableCell;
