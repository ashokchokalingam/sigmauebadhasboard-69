import { useState, useEffect } from "react";
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

  const filteredAlerts = alerts
    .filter(alert => {
      const alertDate = new Date(alert.system_time);
      return alertDate >= sevenDaysAgo;
    })
    .sort((a, b) => 
      new Date(b.system_time).getTime() - new Date(a.system_time).getTime()
    )
    .filter(alert => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

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

  return {
    filters,
    filteredAlerts,
    handleFilterChange
  };
};