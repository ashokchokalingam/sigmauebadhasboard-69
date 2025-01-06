import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Alert } from "../types";
import TimelineLogCard from '../TimelineLogCard';

interface TimelineDetailsTableProps {
  logs: Alert[];
  selectedLog: Alert | null;
  onLogSelect: (log: Alert) => void;
  visibleColumns: string[];
}

const TimelineDetailsTable = ({
  logs,
  selectedLog,
  onLogSelect,
  visibleColumns
}: TimelineDetailsTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-purple-400/5 backdrop-blur-sm sticky top-0 z-10">
        <TableRow className="hover:bg-transparent border-b border-purple-400/20">
          <TableHead className="w-[160px] text-purple-100 font-semibold">Time</TableHead>
          <TableHead className="w-[120px] text-purple-100 font-semibold">User Origin</TableHead>
          <TableHead className="w-[120px] text-purple-100 font-semibold">User Impacted</TableHead>
          <TableHead className="w-[140px] text-purple-100 font-semibold">Computer</TableHead>
          <TableHead className="min-w-[200px] text-purple-100 font-semibold">Event</TableHead>
          <TableHead className="w-[200px] text-purple-100 font-semibold">Tactics</TableHead>
          <TableHead className="w-[200px] text-purple-100 font-semibold">Techniques</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TimelineLogCard
            key={log.id}
            log={log}
            isExpanded={selectedLog?.id === log.id}
            onToggleExpand={onLogSelect}
            visibleColumns={visibleColumns}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default TimelineDetailsTable;