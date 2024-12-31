import { Alert, Stats } from "./types";

export const calculateStats = (alerts: Alert[], totalRecords: number) => {
  // Get dates for 24-hour and 7-day periods
  const now = new Date();
  const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

  // Filter alerts for last 24 hours for stats
  const last24HourAlerts = alerts.filter(alert => 
    new Date(alert.system_time) >= last24Hours && new Date(alert.system_time) <= now
  );

  // Calculate unique users in last 24 hours
  const uniqueUsers = new Set(last24HourAlerts.map(alert => alert.user_id));
  const uniqueComputers = new Set(last24HourAlerts.map(alert => alert.computer_name));

  // Calculate risk scores for last 24 hours
  const calculateAvgRiskScore = (alertsList: Alert[]) => {
    if (alertsList.length === 0) return 0;
    const totalRiskScore = alertsList.reduce((acc, alert) => 
      acc + (alert.rule_level === 'critical' ? 100 : 
        alert.rule_level === 'high' ? 75 : 
        alert.rule_level === 'medium' ? 50 : 25), 0
    );
    return Math.round((totalRiskScore / alertsList.length) * 10) / 10;
  };

  const avgRiskScore = calculateAvgRiskScore(last24HourAlerts);

  // Calculate severity distributions for last 24 hours
  const severityDistribution = {
    critical: last24HourAlerts.filter(alert => alert.rule_level === 'critical').length,
    high: last24HourAlerts.filter(alert => alert.rule_level === 'high').length,
    medium: last24HourAlerts.filter(alert => alert.rule_level === 'medium').length,
    low: last24HourAlerts.filter(alert => alert.rule_level === 'low').length
  };

  // Calculate unique IPs in last 24 hours
  const uniqueIPs = new Set(last24HourAlerts.map(alert => alert.ip_address).filter(Boolean));

  return {
    uniqueUsers: {
      current: uniqueUsers.size,
      change: 0, // Removed comparison since we're only looking at 24 hours
      users: Array.from(uniqueUsers)
    },
    uniqueComputers: {
      current: uniqueComputers.size,
      change: 0, // Removed comparison since we're only looking at 24 hours
      computers: Array.from(uniqueComputers)
    },
    riskScore: {
      current: avgRiskScore,
      change: 0 // Removed comparison since we're only looking at 24 hours
    },
    anomalies: {
      current: last24HourAlerts.length,
      change: 0 // Removed comparison since we're only looking at 24 hours
    },
    severity: severityDistribution,
    uniqueIPs: uniqueIPs.size,
    totalEvents: last24HourAlerts.length,
    totalAnomalies: last24HourAlerts.length
  };
};