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
        
        // Handle empty values
        if (alertValue === null || alertValue === undefined || alertValue === '') {
          return filterValue === '—';
        }

        // Convert to string for comparison
        const stringValue = String(alertValue).trim();
        if (stringValue === '') return filterValue === '—';
        
        // Handle exact matches for certain columns
        if (['event_id', 'ml_cluster', 'risk'].includes(column)) {
          return stringValue === filterValue;
        }
        
        // Default case-insensitive contains match
        return stringValue.toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [alerts, filters]);

  return {
    filters,
    filteredAlerts,
    handleFilterChange
  };
};