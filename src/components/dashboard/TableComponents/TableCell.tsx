import { Tag, Activity } from "lucide-react";
import { Alert } from "../types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/utils/dateTimeUtils";
import { UserCell } from "./cells/UserCell";
import { ComputerCell } from "./cells/ComputerCell";
import { IPAddressCell } from "./cells/IPAddressCell";
import { TitleCell } from "./cells/TitleCell";
import { DescriptionCell } from "./cells/DescriptionCell";
import { ServerInfoCell } from "./cells/ServerInfoCell";
import { RuleCell } from "./cells/RuleCell";
import { TaskCell } from "./cells/TaskCell";
import { RuleLevelCell } from "./cells/RuleLevelCell";
import { BaseIconCell } from "./cells/BaseIconCell";
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
          {formattedTime}
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
      return <TitleCell title={alert.title} />;
    case 'description':
      return <DescriptionCell description={alert.description} />;
    case 'event_id':
      return <ServerInfoCell text={alert.event_id || ''} isBold={true} />;
    case 'provider_name':
      return <ServerInfoCell text={alert.provider_name || ''} />;
    case 'ruleid':
      return <RuleCell text={alert.ruleid || ''} isBold={true} />;
    case 'rule_level':
      return <RuleLevelCell level={alert.rule_level || ''} />;
    case 'task':
      return <TaskCell task={alert.task || ''} />;
    case 'target_domain_name':
      return <ServerInfoCell text={alert.target_domain_name || ''} />;
    case 'tactics':
      return <RuleCell text={alert.tactics || ''} />;
    case 'techniques':
      return <RuleCell text={alert.techniques || ''} />;
    case 'ml_description':
      return <DescriptionCell description={alert.ml_description || ''} />;
    case 'ml_cluster':
      return (
        <BaseIconCell 
          icon={Activity} 
          text={alert.ml_cluster === -1 ? "Noise" : `Cluster ${alert.ml_cluster}`}
          isBold={true}
        />
      );
    case 'tags':
      return <BaseIconCell icon={Tag} text={alert.tags || ''} />;
    default:
      return (
        <span className="text-base font-medium whitespace-nowrap">
          {String(alert[columnKey as keyof Alert] || '-')}
        </span>
      );
  }
};

export default TableCell;
