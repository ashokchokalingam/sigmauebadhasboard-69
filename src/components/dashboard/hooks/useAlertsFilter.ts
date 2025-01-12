import { useState, useEffect } from "react";
import { Alert } from "../types";

export const useAlertsFilter = (alerts: Alert[], visibleColumns: string[]) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(alerts);

  const handleFilterChange = (column: string, value: string) => {
    if (!visibleColumns.includes(column)) {
      return;
    }
    
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  useEffect(() => {
    const filtered = filterAlerts();
    setFilteredAlerts(filtered);
  }, [filters, alerts, visibleColumns]);

  const filterAlerts = () => {
    return alerts.filter(alert => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        if (!visibleColumns.includes(key)) return true;

        if (key === 'system_time') {
          const timeString = new Date(alert[key]).toLocaleTimeString();
          return timeString.toLowerCase().includes(value.toLowerCase());
        }

        if (key === 'users') {
          const userOrigin = String(alert.user_id || '').toLowerCase();
          const userImpacted = String(alert.target_user_name || '').toLowerCase();
          const searchValue = value.toLowerCase();
          return userOrigin.includes(searchValue) || userImpacted.includes(searchValue);
        }

        const alertValue = alert[key as keyof Alert];
        if (!alertValue) return false;
        
        return String(alertValue).toLowerCase().includes(value.toLowerCase());
      });
    });
  };

  return {
    filters,
    filteredAlerts,
    onFilterChange: handleFilterChange,
    filterAlerts
  };
};