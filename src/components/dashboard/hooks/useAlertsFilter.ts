import { useState, useEffect } from "react";
import { Alert } from "../types";
import { ALERTS_PER_PAGE } from "@/constants/pagination";

export const useAlertsFilter = (alerts: Alert[], visibleColumns: string[]) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Reset filters when visible columns change
  useEffect(() => {
    setFilters({});
  }, [visibleColumns]);

  const handleFilterChange = (column: string, value: string) => {
    if (!visibleColumns.includes(column)) {
      return;
    }
    
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const filterAlerts = () => {
    return alerts
      .filter(alert => {
        const alertDate = new Date(alert.system_time);
        return alertDate >= sevenDaysAgo;
      })
      .sort((a, b) => 
        new Date(b.system_time).getTime() - new Date(a.system_time).getTime()
      )
      .slice(0, 1000)
      .filter(alert => {
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
      })
      .slice(0, ALERTS_PER_PAGE);
  };

  return {
    filters,
    handleFilterChange,
    filterAlerts
  };
};