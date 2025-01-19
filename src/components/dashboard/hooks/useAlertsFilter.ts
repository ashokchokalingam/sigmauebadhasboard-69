import { useState, useMemo } from "react";
import { Alert } from "../types";

export const useAlertsFilter = (alerts: Alert[]) => {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (column: string, value: string) => {
    if (!value || value.toLowerCase() === 'all') {
      const newFilters = { ...filters };
      delete newFilters[column];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({
        ...prev,
        [column]: value
      }));
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      return Object.entries(filters).every(([column, filterValue]) => {
        if (!filterValue) return true;

        const alertValue = alert[column as keyof Alert];
        
        // Handle null or undefined values
        if (alertValue === null || alertValue === undefined) {
          return filterValue.toLowerCase() === 'n/a';
        }

        // Handle system_time separately
        if (column === 'system_time') {
          const alertTime = new Date(alertValue as string).toLocaleTimeString();
          return alertTime.toLowerCase().includes(filterValue.toLowerCase());
        }

        // Handle numeric values
        if (typeof alertValue === 'number') {
          return String(alertValue).includes(filterValue);
        }

        // Handle string values with case-insensitive comparison
        if (typeof alertValue === 'string') {
          return alertValue.toLowerCase().includes(filterValue.toLowerCase());
        }

        // Handle arrays
        if (Array.isArray(alertValue)) {
          return alertValue.some(item => 
            String(item).toLowerCase().includes(filterValue.toLowerCase())
          );
        }

        // Handle objects
        if (typeof alertValue === 'object') {
          return JSON.stringify(alertValue)
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }

        return String(alertValue).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [alerts, filters]);

  return {
    filters,
    filteredAlerts,
    handleFilterChange
  };
};