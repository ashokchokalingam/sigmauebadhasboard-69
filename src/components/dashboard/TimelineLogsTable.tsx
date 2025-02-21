
import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { tableStyles } from "./styles/TimelineTableStyles";
import TimelineTableHeader from "./TimelineTableHeader";
import TimelineTableRow from "./TimelineTableRow";
import TimelineExpandedContent from "./TimelineExpandedContent";
import { Alert } from "./types";

interface TimelineLogsTableProps {
  logs: any[];
  visibleColumns: string[];
  dataSource: 'mloutliers' | 'anomalies';
  onDataSourceChange: (source: 'mloutliers' | 'anomalies') => void;
}

const TimelineLogsTable = ({ 
  logs,
  visibleColumns,
  dataSource,
  onDataSourceChange
}: TimelineLogsTableProps) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  
  if (!logs.length) return null;

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="mt-4 bg-[#151823] rounded-xl overflow-hidden border border-indigo-500/10 shadow-2xl">
      <style>{tableStyles}</style>
      
      <div className="overflow-x-auto max-h-[800px] overflow-y-auto custom-table">
        <Table>
          <TimelineTableHeader />
          <TableBody>
            {logs.map((log, index) => (
              <>
                <TimelineTableRow
                  key={index}
                  log={log}
                  index={index}
                  isExpanded={expandedRow === index}
                  onClick={() => toggleRow(index)}
                />
                {expandedRow === index && (
                  <TimelineExpandedContent log={log} />
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TimelineLogsTable;
