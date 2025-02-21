
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
    <div className="mt-4 bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <AnomaliesTableHeaderSection
        visibleColumns={visibleColumns}
        onColumnToggle={() => {}}
        onSelectAll={() => {}}
        onDeselectAll={() => {}}
        dataSource={dataSource}
        onDataSourceChange={onDataSourceChange}
      />
      
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                     text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 
                     focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 bg-gray-50 text-gray-600 border-b border-gray-200" />
              <TableHead className="whitespace-nowrap px-4 py-2 bg-gray-50 text-gray-600 border-b border-gray-200">
                Time
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-2 bg-gray-50 text-gray-600 border-b border-gray-200">
                Title
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log, index) => (
              <>
                <TableRow 
                  key={`row-${index}`}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  <TableCell className="w-8 text-center">
                    {expandedRows.has(index) ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {formatDateTime(log.system_time || '', false)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {log.title || ''}
                  </TableCell>
                </TableRow>
                {expandedRows.has(index) && (
                  <TableRow>
                    <TableCell colSpan={3} className="bg-gray-50 p-0">
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-500">COMPUTER NAME</div>
                            <div className="text-sm text-gray-900">{log.computer_name || 'N/A'}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-500">EVENT ID</div>
                            <div className="text-sm text-gray-900">{log.event_id || 'N/A'}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-500">DESCRIPTION</div>
                              <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200">
                                {log.description || 'N/A'}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-500">ML CLUSTER</div>
                            <div className="text-sm text-gray-900">{log.ml_cluster || 'N/A'}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-500">PROVIDER NAME</div>
                            <div className="text-sm text-gray-900">{log.provider_name || 'N/A'}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-500">ML DESCRIPTION</div>
                              <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200">
                                {log.ml_description || 'N/A'}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-500">RISK</div>
                            <div className="text-sm text-gray-900">{log.risk || 'N/A'}</div>
                          </div>
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
