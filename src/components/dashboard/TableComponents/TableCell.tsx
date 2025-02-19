
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
        <span className="text-base font-medium whitespace-nowrap">
          {format(new Date(alert.system_time), "MMM dd, yyyy, hh:mm:ss aa")}
        </span>
      );
    case 'user_id':
      return (
        <div className="flex items-center min-w-0">
          <User className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span 
            className="hover:text-blue-400 cursor-pointer truncate text-base font-medium whitespace-nowrap"
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
        <div className="flex items-center min-w-0">
          <User className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span 
            className="hover:text-blue-400 cursor-pointer truncate text-base font-medium whitespace-nowrap"
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
        <div className="flex items-center min-w-0">
          <Monitor className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span 
            className="hover:text-blue-400 cursor-pointer truncate text-base font-medium whitespace-nowrap"
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
          <Hash className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
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
    case 'ip_address':
      return (
        <div className="flex items-center min-w-0">
          <Network className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="text-base font-medium whitespace-nowrap">{alert.ip_address || '-'}</span>
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
        <div className="flex items-center min-w-0">
          <AlertTriangle className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="text-base font-medium capitalize whitespace-nowrap">{alert.rule_level || '-'}</span>
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
    case 'risk':
      return (
        <div className="flex items-center min-w-0">
          <AlertTriangle className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="text-base font-medium whitespace-nowrap">{alert.risk || '-'}</span>
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
