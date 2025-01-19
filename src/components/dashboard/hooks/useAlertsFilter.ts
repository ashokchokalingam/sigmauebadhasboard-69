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
        const filterLower = filterValue.toLowerCase();
        
        // Special handling for null/undefined values
        if (alertValue === null || alertValue === undefined) {
          return filterLower === 'n/a';
        }

        // Handle different value types
        if (typeof alertValue === 'number') {
          if (filterLower === 'n/a') return false;
          return alertValue.toString().includes(filterValue);
        }

        if (typeof alertValue === 'string') {
          if (filterLower === 'n/a') return false;
          return alertValue.toLowerCase().includes(filterLower);
        }

        // Handle arrays (like tags)
        if (Array.isArray(alertValue)) {
          if (filterLower === 'n/a') return alertValue.length === 0;
          return alertValue.some(item => 
            item?.toString().toLowerCase().includes(filterLower)
          );
        }

        // Handle objects
        if (typeof alertValue === 'object') {
          if (filterLower === 'n/a') return false;
          return JSON.stringify(alertValue)
            .toLowerCase()
            .includes(filterLower);
        }

        return false;
      });
    });
  }, [alerts, filters]);

  return {
    filters,
    filteredAlerts,
    handleFilterChange
  };
};