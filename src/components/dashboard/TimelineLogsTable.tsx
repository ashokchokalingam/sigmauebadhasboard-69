
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDateTime } from "@/utils/dateTimeUtils";
import AnomaliesTableHeaderSection from "./AnomaliesTableHeaderSection";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredLogs = logs.filter(log => 
    log.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.system_time?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-4 bg-[#1A1F2C] rounded-xl overflow-hidden border border-indigo-500/10 shadow-2xl">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          
          .custom-table {
            font-family: 'Inter', sans-serif;
          }
          
          .metadata-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
          }
          
          .metadata-card {
            background: linear-gradient(to bottom right, rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.8));
            border: 1px solid rgba(99, 102, 241, 0.1);
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(8px);
          }

          .hover-glow:hover {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
          }
        `}
      </style>
      
      <div className="p-4 border-b border-indigo-500/10 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-indigo-400" />
          <input
            type="text"
            placeholder="Search in logs..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/50 border border-indigo-500/20 rounded-lg 
                     text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 
                     focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 bg-slate-800/50 text-indigo-300 font-semibold border-b border-indigo-500/10" />
              <TableHead className="whitespace-nowrap px-4 py-3 bg-slate-800/50 text-indigo-300 font-semibold border-b border-indigo-500/10">
                Time
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 bg-slate-800/50 text-indigo-300 font-semibold border-b border-indigo-500/10">
                Title
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log, index) => (
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
                    {log.title || ''}
                  </TableCell>
                </TableRow>
                {expandedRows.has(index) && (
                  <TableRow>
                    <TableCell colSpan={3} className="p-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 bg-slate-800/50 p-4 rounded-xl border border-indigo-500/10 shadow-lg hover-glow">
                            <div className="text-sm font-medium text-indigo-400 uppercase tracking-wider">Description</div>
                            <div className="text-sm text-slate-300 leading-relaxed">
                              {log.description || 'N/A'}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-slate-800/50 rounded-lg border border-indigo-500/10 shadow-lg hover-glow">
                                <div className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-1">Computer Name</div>
                                <div className="text-sm text-slate-300 font-medium">{log.computer_name || 'N/A'}</div>
                              </div>
                              <div className="p-3 bg-slate-800/50 rounded-lg border border-indigo-500/10 shadow-lg hover-glow">
                                <div className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-1">Event ID</div>
                                <div className="text-sm text-slate-300 font-medium">{log.event_id || 'N/A'}</div>
                              </div>
                            </div>
                            
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-indigo-500/10 shadow-lg hover-glow">
                              <div className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-1">Provider Name</div>
                              <div className="text-sm text-slate-300">{log.provider_name || 'N/A'}</div>
                            </div>
                          </div>
                          
                          <div className="col-span-2">
                            <div className="space-y-2 bg-slate-800/50 p-4 rounded-xl border border-indigo-500/10 shadow-lg hover-glow">
                              <div className="text-sm font-medium text-indigo-400 uppercase tracking-wider">ML Description</div>
                              <div className="text-sm text-slate-300 leading-relaxed">
                                {log.ml_description || 'N/A'}
                              </div>
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
