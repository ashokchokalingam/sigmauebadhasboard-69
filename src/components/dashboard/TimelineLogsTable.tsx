
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
    <div className="mt-4 bg-[#1A1F2C] rounded-lg overflow-hidden border border-purple-900/20">
      <AnomaliesTableHeaderSection
        visibleColumns={visibleColumns}
        onColumnToggle={() => {}}
        onSelectAll={() => {}}
        onDeselectAll={() => {}}
        dataSource={dataSource}
        onDataSourceChange={onDataSourceChange}
      />
      
      <div className="p-4 border-b border-purple-900/20">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full pl-9 pr-4 py-2 bg-[#12131A] border border-purple-900/20 rounded-lg 
                     text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-1 
                     focus:ring-purple-500/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 bg-[#1A1F2C] text-[#9b87f5] border-b border-purple-900/20" />
              <TableHead className="whitespace-nowrap px-4 py-2 bg-[#1A1F2C] text-[#9b87f5] border-b border-purple-900/20">
                Time
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-2 bg-[#1A1F2C] text-[#9b87f5] border-b border-purple-900/20">
                Title
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log, index) => (
              <>
                <TableRow 
                  key={`row-${index}`}
                  className="border-b border-purple-900/10 hover:bg-purple-900/5 cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  <TableCell className="w-8 text-center">
                    {expandedRows.has(index) ? (
                      <ChevronDown className="h-4 w-4 text-purple-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-purple-400" />
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-2 text-blue-300/70">
                    {formatDateTime(log.system_time || '', false)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-2 text-blue-300/70">
                    {log.title || ''}
                  </TableCell>
                </TableRow>
                {expandedRows.has(index) && (
                  <TableRow>
                    <TableCell colSpan={3} className="bg-[#12131A]/50 p-0">
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(log).map(([key, value]) => {
                            if (key === 'raw') return null;
                            if (!value) return null;
                            return (
                              <div key={key} className="space-y-1">
                                <div className="text-sm font-medium text-purple-400">
                                  {key.replace(/_/g, ' ').toUpperCase()}
                                </div>
                                <div className="text-sm text-blue-300/70">
                                  {String(value)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {log.raw && <TimelineRawLog alert={log as Alert} />}
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
