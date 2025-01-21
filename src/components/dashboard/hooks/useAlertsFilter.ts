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
        
        // Get the value for the specific column
        const alertValue = alert[column as keyof Alert];
        
        // Handle null/undefined/empty values consistently
        if (alertValue === null || alertValue === undefined || alertValue === '') {
          return filterValue === '—';
        }

        // Ensure type safety when comparing values
        const normalizedAlertValue = String(alertValue).trim().toLowerCase();
        const normalizedFilterValue = filterValue.toLowerCase();

        // Special handling for numeric columns with strict type checking
        if (column === 'risk') {
          const numericValue = Number(alertValue);
          const filterNumericValue = Number(filterValue);
          return !isNaN(numericValue) && !isNaN(filterNumericValue) && 
                 numericValue === filterNumericValue;
        }

        if (column === 'ml_cluster') {
          const numericValue = Number(alertValue);
          const filterNumericValue = Number(filterValue);
          return !isNaN(numericValue) && !isNaN(filterNumericValue) && 
                 numericValue === filterNumericValue;
        }

        // Special handling for array-like string values
        if (['tactics', 'techniques', 'tags'].includes(column)) {
          const values = normalizedAlertValue.split(',').map(v => v.trim());
          return values.includes(normalizedFilterValue);
        }

        // IP address specific handling
        if (column === 'ip_address') {
          return normalizedAlertValue === normalizedFilterValue;
        }

        // Default string comparison
        return normalizedAlertValue.includes(normalizedFilterValue);
      });
    }).map(alert => {
      // Ensure data structure integrity by creating a new object with all required fields
      return {
        ...alert,
        id: alert.id,
        title: alert.title,
        description: alert.description,
        system_time: alert.system_time,
        user_impacted: alert.user_impacted,
        tags: alert.tags,
        risk: alert.risk,
        ip_address: alert.ip_address,
        ml_cluster: alert.ml_cluster
      };
    });
  }, [alerts, filters]);

  // Add validation to ensure data structure integrity
  const validatedAlerts = useMemo(() => {
    return filteredAlerts.map(alert => {
      // Ensure all required fields are present with their correct types
      const validated: Alert = {
        ...alert,
        id: alert.id || '',
        title: alert.title || '',
        description: alert.description || '',
        system_time: alert.system_time || new Date().toISOString(),
        user_impacted: alert.user_impacted || '',
        tags: alert.tags || '',
        risk: typeof alert.risk === 'number' ? alert.risk : null,
        ip_address: alert.ip_address || '',
        ml_cluster:I understand the issue - when applying the IP address filter, the data from the risk_score column is incorrectly showing up in the IP address column. This indicates a problem with the filter logic and data structure preservation. Let's fix this by updating the filtering logic to maintain proper column mappings.

<lov-code>
Let's update the useAlertsFilter hook to ensure data integrity during filtering:

<lov-write file_path="src/components/dashboard/hooks/useAlertsFilter.ts">
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
        
        // Get the value for the specific column
        const alertValue = alert[column as keyof Alert];
        
        // Handle null/undefined/empty values consistently
        if (alertValue === null || alertValue === undefined || alertValue === '') {
          return filterValue === '—';
        }

        // Ensure we maintain type safety and proper column mapping
        const normalizedAlertValue = String(alertValue).trim().toLowerCase();
        const normalizedFilterValue = filterValue.toLowerCase();

        // Special handling for numeric columns with strict type checking
        if (column === 'risk') {
          const numericValue = Number(alertValue);
          const filterNumericValue = Number(filterValue);
          return !isNaN(numericValue) && !isNaN(filterNumericValue) && 
                 numericValue === filterNumericValue;
        }

        if (column === 'ml_cluster') {
          const numericValue = Number(alertValue);
          const filterNumericValue = Number(filterValue);
          return !isNaN(numericValue) && !isNaN(filterNumericValue) && 
                 numericValue === filterNumericValue;
        }

        // Special handling for IP address column
        if (column === 'ip_address') {
          return normalizedAlertValue === normalizedFilterValue;
        }

        // Handle array-like string values
        if (['tactics', 'techniques', 'tags'].includes(column)) {
          const values = normalizedAlertValue.split(',').map(v => v.trim());
          return values.includes(normalizedFilterValue);
        }

        // Default string comparison
        return normalizedAlertValue.includes(normalizedFilterValue);
      });
    });
  }, [alerts, filters]);

  // Validate the filtered data structure
  const validatedAlerts = useMemo(() => {
    return filteredAlerts.map(alert => {
      // Ensure all required fields maintain their correct types and positions
      const validated: Alert = {
        ...alert,
        id: alert.id,
        title: alert.title,
        description: alert.description,
        system_time: alert.system_time,
        user_impacted: alert.user_impacted,
        tags: alert.tags,
        risk: typeof alert.risk === 'number' ? alert.risk : null,
        ip_address: alert.ip_address || '',
        ml_cluster: typeof alert.ml_cluster === 'number' ? alert.ml_cluster : null,
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