import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Alert } from "./types";
import UserOriginCell from "./TableCells/UserOriginCell";
import UserImpactedCell from "./TableCells/UserImpactedCell";
import ComputerCell from "./TableCells/ComputerCell";
import TimeCell from "./TableCells/TimeCell";
import TitleCell from "./TableCells/TitleCell";
import DescriptionCell from "./TableCells/DescriptionCell";
import RiskScoreCell from "./TableCells/RiskScoreCell";
import BasicCell from "./TableCells/BasicCell";

interface AlertTableRowProps {
  alert: Alert;
  isSelected: boolean;
  onToggle: () => void;
  onTimelineView: (type: "user" | "computer", id: string) => void;
  visibleColumns: string[];
}

const AlertTableRow = ({ 
  alert, 
  isSelected, 
  onToggle, 
  onTimelineView,
  visibleColumns 
}: AlertTableRowProps) => {
  const renderCell = (columnKey: string) => {
    switch (columnKey) {
      case "system_time":
        return <TimeCell time={alert.system_time} />;
      case "user_origin":
        return (
          <UserOriginCell 
            userId={alert.user_id} 
            onTimelineView={onTimelineView} 
          />
        );
      case "user_impacted":
        return (
          <UserImpactedCell 
            userName={alert.target_user_name} 
          />
        );
      case "computer_name":
        return (
          <ComputerCell 
            computerName={alert.computer_name} 
            onTimelineView={onTimelineView} 
          />
        );
      case "title":
        return <TitleCell title={alert.title} />;
      case "description":
        return <DescriptionCell description={alert.description} />;
      case "event_id":
        return <BasicCell value={alert.event_id} />;
      case "provider_name":
        return <BasicCell value={alert.provider_name} />;
      case "ml_cluster":
        return <BasicCell value={alert.ml_cluster === null ? '—' : alert.ml_cluster} />;
      case "ip_address":
        return <BasicCell value={alert.ip_address} />;
      case "ruleid":
        return <BasicCell value={alert.ruleid} />;
      case "rule_level":
        return <BasicCell value={alert.rule_level} />;
      case "task":
        return <BasicCell value={alert.task} />;
      case "target_domain_name":
        return <BasicCell value={alert.target_domain_name} />;
      case "tactics":
        return <BasicCell value={alert.tactics} />;
      case "techniques":
        return <BasicCell value={alert.techniques} />;
      case "ml_description":
        return <BasicCell value={alert.ml_description} />;
      case "risk":
        return <RiskScoreCell risk={alert.risk} />;
      case "tags":
        return <BasicCell value={alert.tags} />;
      case "raw":
        return <BasicCell value={alert.raw} />;
      default:
        return <BasicCell value={alert[columnKey as keyof Alert]} />;
    }
  };
  
  return (
    <TableRow 
      className={`h-14 transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-950/40' : ''
      }`}
      onClick={onToggle}
    >
      {visibleColumns.map((columnKey) => (
        <TableCell key={columnKey} className="px-4 py-2">
          {renderCell(columnKey)}
        </TableCell>
      ))}
      <TableCell className="w-4">
        <ChevronRight 
          className={`h-4 w-4 text-blue-400/70 transition-transform ${
            isSelected ? 'rotate-90' : ''
          }`}
        />
      </TableCell>
    </TableRow>
  );
};

export default AlertTableRow;