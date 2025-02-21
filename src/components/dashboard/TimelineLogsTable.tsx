
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
  // Change from Set to single number, null means no row is expanded
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  
  if (!logs.length) return null;

  const toggleRow = (index: number) => {
    // If clicking the same row, collapse it. Otherwise, expand the clicked row
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="mt-4 bg-[#151823] rounded-xl overflow-hidden border border-indigo-500/10 shadow-2xl">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          
          .custom-table {
            font-family: 'Inter', sans-serif;
          }
          
          .description-text {
            color: #94A3B8;
            line-height: 1.6;
          }

          .header-gradient {
            background: linear-gradient(to right, #1E293B, #151823);
          }

          .expanded-row {
            background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(30, 41, 59, 0.2) 100%);
            backdrop-filter: blur(12px);
          }

          .detail-card {
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(99, 102, 241, 0.1);
            border-radius: 0.5rem;
          }

          .detail-header {
            color: #818CF8;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
          }

          .detail-value {
            color: #E2E8F0;
            font-size: 0.875rem;
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
              <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
                Risk Level
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, index) => (
              <>
                <TableRow 
                  key={`row-${index}`}
                  className={`border-b border-indigo-500/10 cursor-pointer transition-colors duration-150
                    ${expandedRow === index ? 'bg-indigo-500/5' : 'hover:bg-indigo-500/5'}`}
                  onClick={() => toggleRow(index)}
                >
                  <TableCell className="w-8 text-center">
                    {expandedRow === index ? (
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
                  <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {log.rule_level || 'N/A'}
                  </TableCell>
                </TableRow>
                {expandedRow === index && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <div className="py-6 px-8 expanded-row border-b border-indigo-500/10">
                        <div className="grid gap-6">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="detail-card p-4">
                              <div className="detail-header">System Time</div>
                              <div className="detail-value">{formatDateTime(log.system_time || '', true)}</div>
                            </div>
                            <div className="detail-card p-4">
                              <div className="detail-header">Risk Score</div>
                              <div className="detail-value">{log.risk || 'N/A'}</div>
                            </div>
                            <div className="detail-card p-4">
                              <div className="detail-header">User ID</div>
                              <div className="detail-value">{log.user_id || 'N/A'}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="detail-card p-4">
                              <div className="detail-header">Target User Name</div>
                              <div className="detail-value">{log.target_user_name || 'N/A'}</div>
                            </div>
                            <div className="detail-card p-4">
                              <div className="detail-header">Target Domain Name</div>
                              <div className="detail-value">{log.target_domain_name || 'N/A'}</div>
                            </div>
                            <div className="detail-card p-4">
                              <div className="detail-header">Task</div>
                              <div className="detail-value">{log.task || 'N/A'}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="detail-card p-4">
                              <div className="detail-header">Tactics</div>
                              <div className="detail-value">{log.tactics || 'N/A'}</div>
                            </div>
                            <div className="detail-card p-4">
                              <div className="detail-header">Techniques</div>
                              <div className="detail-value">{log.techniques || 'N/A'}</div>
                            </div>
                          </div>

                          <div className="detail-card p-4">
                            <div className="detail-header">Description</div>
                            <div className="detail-value whitespace-pre-wrap">
                              {log.description || 'N/A'}
                            </div>
                          </div>

                          <div className="detail-card p-4">
                            <div className="detail-header">ML Description</div>
                            <div className="detail-value whitespace-pre-wrap">
                              {log.ml_description || 'N/A'}
                            </div>
                          </div>

                          <div className="detail-card p-4">
                            <div className="detail-header">Tags</div>
                            <div className="detail-value">{log.tags || 'N/A'}</div>
                          </div>

                          {log.raw && <TimelineRawLog alert={log as Alert} />}
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
