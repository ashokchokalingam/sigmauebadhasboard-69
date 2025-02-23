
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
    <div className="mt-4 rounded-xl overflow-hidden border border-slate-800">
      <style>{tableStyles}</style>
      
      <div className="overflow-x-auto max-h-[800px] overflow-y-auto custom-table">
        <Table>
          <TimelineTableHeader />
          <TableBody className="relative">
            {logs.map((log, index) => (
              <>
                <TimelineTableRow
                  key={`log-${log.id || index}`}
                  log={log}
                  index={index}
                  isExpanded={expandedRow === index}
                  onClick={() => toggleRow(index)}
                />
                {expandedRow === index && (
                  <tr className="expanded-content">
                    <td colSpan={9}>
                      <TimelineExpandedContent 
                        log={log} 
                        onClose={() => setExpandedRow(null)}
                      />
                    </td>
                  </tr>
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
