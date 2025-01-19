import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Download, 
  SlidersHorizontal,
  Search,
  RefreshCcw
} from 'lucide-react';
import { Alert } from "./types";
import { format } from 'date-fns';

interface ChronoGridProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const ChronoGrid: React.FC<ChronoGridProps> = ({ alerts, onLoadMore, hasMore }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Alert;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: keyof Alert) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const handleFilter = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const filteredAlerts = alerts.filter(alert => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const alertValue = String(alert[key as keyof Alert] || '').toLowerCase();
      return alertValue.includes(value.toLowerCase());
    });
  }).filter(alert => {
    if (!searchTerm) return true;
    return Object.values(alert).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="rounded-lg border border-grid-border bg-grid-row overflow-hidden">
      <div className="p-4 bg-grid-header border-b border-grid-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Chrono Analysis Grid</h2>
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                className="pl-9 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Columns
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-grid-header">
            <TableRow className="hover:bg-grid-header">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  Time
                  <button onClick={() => handleSort('system_time')} className="opacity-50 hover:opacity-100">
                    {sortConfig?.key === 'system_time' ? (
                      sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </TableHead>
              <TableHead className="font-semibold">User Origin</TableHead>
              <TableHead className="font-semibold">User Impacted</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Computer</TableHead>
              <TableHead className="font-semibold text-right">Risk Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAlerts.map((alert, index) => (
              <TableRow 
                key={alert.id} 
                className={`
                  ${index % 2 === 0 ? 'bg-grid-row' : 'bg-grid-row-alt'}
                  hover:bg-grid-hover transition-colors
                `}
              >
                <TableCell className="font-mono">
                  {format(new Date(alert.system_time), 'MMM dd, yyyy HH:mm:ss')}
                </TableCell>
                <TableCell>{alert.user_origin || 'system'}</TableCell>
                <TableCell>{alert.user_impacted || '-'}</TableCell>
                <TableCell className="max-w-[300px] truncate">{alert.title}</TableCell>
                <TableCell className="max-w-[400px] truncate">{alert.description}</TableCell>
                <TableCell>{alert.computer_name}</TableCell>
                <TableCell className="text-right">
                  <span className={`
                    px-2 py-1 rounded-full text-sm
                    ${Number(alert.risk) >= 80 ? 'bg-red-500/20 text-red-400' :
                      Number(alert.risk) >= 60 ? 'bg-orange-500/20 text-orange-400' :
                      Number(alert.risk) >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'}
                  `}>
                    {alert.risk}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {hasMore && (
        <div className="p-4 border-t border-grid-border bg-grid-header">
          <Button 
            onClick={onLoadMore}
            variant="outline" 
            className="w-full"
          >
            Load More Results
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChronoGrid;