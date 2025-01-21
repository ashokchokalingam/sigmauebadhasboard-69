import { useState, useMemo } from "react";
import { Alert } from "../types";

export const useAlertsFilter = (alerts: Alert[]) => {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (column: string, value: string) => {
    if (!value || value.toLowerCase() === 'all') {
      const newFilters = { ...filters };
      delete newFilters[column];
      setFilters(newFilters);
      console.log('Filter removed for column:', column);
    } else {
      setFilters(prev => {
        const newFilters = {
          ...prev,
          [column]: value
        };
        console.log('Applied filter:', { column, value });
        return newFilters;
      });
    }
  };

  const filteredAlerts = useMemo(() => {
    console.log('Applying filters:', filters);
    
    return alerts.filter(alert => {
      return Object.entries(filters).every(([column, filterValue]) => {
        if (!filterValue) return true;
        
        // Ensure we're accessing a valid key from the Alert type
        const alertValue = alert[column as keyof Alert];
        
        // Handle null/undefined/empty values consistently
        if (alertValue === null || alertValue === undefined || alertValue === '') {
          return filterValue === '—';
        }

        // Convert to string and normalize for comparison
        const normalizedAlertValue = String(alertValue).trim().toLowerCase();
        const normalizedFilterValue = filterValue.toLowerCase();

        // Special handling for numeric columns
        if (['event_id', 'ml_cluster', 'risk'].includes(column)) {
          return normalizedAlertValue === normalizedFilterValue;
        }

        // Special handling for array-like string values (comma-separated)
        if (['tactics', 'techniques', 'tags'].includes(column)) {
          const values = normalizedAlertValue.split(',').map(v => v.trim());
          return values.some(v => v === normalizedFilterValue);
        }

        // Default case: partial match for string values
        return normalizedAlertValue.includes(normalizedFilterValue);
      });
    });
  }, [alerts, filters]);

  // Add validation to ensure data structure integrity
  const validatedAlerts = useMemo(() => {
    return filteredAlerts.map(alert => {
      // Ensure all required fields are present
      const validated: Alert = {
        ...alert,
        id: alert.id || '',
        title: alert.title || '',
        description: alert.description || '',
        system_time: alert.system_time || new Date().toISOString(),
        user_impacted: alert.user_impacted || '',
        tags: alert.tags || '',
      };
      return validated;
    });
  }, [filteredAlerts]);

  return {
    filters,
    filteredAlerts: validatedAlerts,
    handleFilterChange
  };
};