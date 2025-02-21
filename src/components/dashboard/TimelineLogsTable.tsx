
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDateTime } from "@/utils/dateTimeUtils";
import AnomaliesTableHeaderSection from "./AnomaliesTableHeaderSection";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import TimelineRawLog from "./TimelineRawLog";
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
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  if (!logs.length) return null;

  const toggleRow = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="mt-4 bg-[#1A1F2C] rounded-xl overflow-hidden border border-indigo-500/10 shadow-2xl">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          
          .custom-table {
            font-family: 'Inter', sans-serif;
          }
          
          .hover-glow:hover {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
          }

          .description-text {
            color: #94A3B8;
            line-height: 1.6;
          }

          .header-gradient {
            background: linear-gradient(to right, #1E293B, #1A1F2C);
          }

          .content-gradient {
            background: linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(30, 41, 59, 0.2) 100%);
          }
        `}
      </style>
      
      <div className="overflow-x-auto max-h-[800px] overflow-y-auto custom-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10" />
              <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
                Time
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
                Event ID
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
                Title
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
                Computer Name
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
                Provider Name
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, index) => (
              <>
                <TableRow 
                  key={`row-${index}`}
                  className="border-b border-indigo-500/10 hover:bg-indigo-500/5 cursor-pointer transition-colors duration-150"
                  onClick={() => toggleRow(index)}
                >
                  <TableCell className="w-8 text-center">
                    {expandedRows.has(index) ? (
                      <ChevronDown className="h-4 w-4 text-indigo-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300 font-medium">
                    {formatDateTime(log.system_time || '', false)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {log.event_id || 'N/A'}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {log.title || ''}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {log.computer_name || 'N/A'}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {log.provider_name || 'N/A'}
                  </TableCell>
                </TableRow>
                {expandedRows.has(index) && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0 content-gradient">
                      <div className="p-6 space-y-6">
                        <div className="space-y-6">
                          <div className="space-y-2 bg-slate-800/50 p-4 rounded-xl border border-indigo-500/10 shadow-lg hover-glow">
                            <div className="text-sm font-medium text-indigo-400 uppercase tracking-wider">Description</div>
                            <div className="text-sm description-text">
                              {log.description || 'N/A'}
                            </div>
                          </div>
                          
                          <div className="space-y-2 bg-slate-800/50 p-4 rounded-xl border border-indigo-500/10 shadow-lg hover-glow">
                            <div className="text-sm font-medium text-indigo-400 uppercase tracking-wider">ML Description</div>
                            <div className="text-sm description-text">
                              {log.ml_description || 'N/A'}
                            </div>
                          </div>
                          
                          <div className="col-span-2">
                            {log.raw && <TimelineRawLog alert={log as Alert} />}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
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
