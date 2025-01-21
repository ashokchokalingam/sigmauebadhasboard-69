import React from 'react';
import { Alert } from "./types";
import { Card } from "@/components/ui/card";
import AlertHeader from "./AlertDetailsSections/AlertHeader";
import { Table } from "@/components/ui/table";
import TimeCell from "./TableCells/TimeCell";
import UserOriginCell from "./TableCells/UserOriginCell";
import UserImpactedCell from "./TableCells/UserImpactedCell";
import TitleCell from "./TableCells/TitleCell";
import DescriptionCell from "./TableCells/DescriptionCell";
import ComputerCell from "./TableCells/ComputerCell";
import RiskScoreCell from "./TableCells/RiskScoreCell";

interface AlertDetailsViewProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetailsView = ({ alert, onClose }: AlertDetailsViewProps) => {
  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="h-full flex flex-col bg-[#1E1E2F]">
      <AlertHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
        <div className="p-6 space-y-6">
          <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-6">
            <h3 className="text-xl font-semibold text-[#E0E0E0] mb-4">Alert Timeline</h3>
            
            <div className="overflow-x-auto">
              <Table>
                <thead className="border-b border-blue-500/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-blue-400">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-blue-400">User Origin</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-blue-400">User Impacted</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-blue-400">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-blue-400">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-blue-400">Computer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-blue-400">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-blue-500/10 hover:bg-blue-500/5">
                    <td className="px-4 py-3">
                      <TimeCell time={alert.system_time} />
                    </td>
                    <td className="px-4 py-3">
                      <UserOriginCell 
                        userId={alert.user_id || ''} 
                        onTimelineView={() => {}} 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <UserImpactedCell userName={alert.target_user_name || ''} />
                    </td>
                    <td className="px-4 py-3">
                      <TitleCell title={alert.title} />
                    </td>
                    <td className="px-4 py-3">
                      <DescriptionCell description={alert.description} />
                    </td>
                    <td className="px-4 py-3">
                      <ComputerCell 
                        computerName={alert.computer_name || ''} 
                        onTimelineView={() => {}} 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <RiskScoreCell risk={alert.risk || null} />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card>

          {alert.raw && (
            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-6">
              <h3 className="text-xl font-semibold text-[#E0E0E0] mb-4">Raw Event Data</h3>
              <pre className="bg-[#1A1F2C] p-4 rounded-lg overflow-x-auto text-sm text-blue-200/70 font-mono">
                {typeof alert.raw === 'string' ? alert.raw : JSON.stringify(alert.raw, null, 2)}
              </pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsView;