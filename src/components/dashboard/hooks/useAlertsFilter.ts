import { useState, useMemo } from "react";
import { Alert } from "../types";

export const useAlertsFilter = (alerts: Alert[]) => {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const handleFilterChange = (column: string, value: string) => {
    if (!value) {
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
        if (column === 'users') {
          return (
            alert.user_id?.toLowerCase().includes(filterValue.toLowerCase()) ||
            alert.target_user_name?.toLowerCase().includes(filterValue.toLowerCase())
          );
        }

        if (typeof alertValue === 'string') {
          return alertValue.toLowerCase().includes(filterValue.toLowerCase());
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