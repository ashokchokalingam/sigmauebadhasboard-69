import { Alert, Stats } from "./types";

export const calculateStats = (alerts: Alert[]) => {
  // Get dates for 7-day periods
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  const fourteenDaysAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));

  // Filter alerts for current and previous 7-day periods
  const currentPeriodAlerts = alerts.filter(alert => 
    new Date(alert.system_time) >= sevenDaysAgo && new Date(alert.system_time) <= now
  );

  const previousPeriodAlerts = alerts.filter(alert => 
    new Date(alert.system_time) >= fourteenDaysAgo && new Date(alert.system_time) < sevenDaysAgo
  );

  // Calculate unique users
  const currentUniqueUsers = new Set(currentPeriodAlerts.map(alert => alert.user_id));
  const previousUniqueUsers = new Set(previousPeriodAlerts.map(alert => alert.user_id));
  const userChangePercent = previousUniqueUsers.size ? 
    Math.round(((currentUniqueUsers.size - previousUniqueUsers.size) / previousUniqueUsers.size) * 100) : 0;

  // Calculate unique computers
  const currentUniqueComputers = new Set(currentPeriodAlerts.map(alert => alert.computer_name));
  const previousUniqueComputers = new Set(previousPeriodAlerts.map(alert => alert.computer_name));
  const computerChangePercent = previousUniqueComputers.size ? 
    Math.round(((currentUniqueComputers.size - previousUniqueComputers.size) / previousUniqueComputers.size) * 100) : 0;

  // Calculate risk scores
  const calculateAvgRiskScore = (alertsList: Alert[]) => {
    if (alertsList.length === 0) return 0;
    const totalRiskScore = alertsList.reduce((acc, alert) => 
      acc + (alert.rule_level === 'critical' ? 100 : 
        alert.rule_level === 'high' ? 75 : 
        alert.rule_level === 'medium' ? 50 : 25), 0
    );
    return Math.round((totalRiskScore / alertsList.length) * 10) / 10;
  };

  const currentAvgRiskScore = calculateAvgRiskScore(currentPeriodAlerts);
  const previousAvgRiskScore = calculateAvgRiskScore(previousPeriodAlerts);
  const riskScoreChangePercent = previousAvgRiskScore ? 
    Math.round(((currentAvgRiskScore - previousAvgRiskScore) / previousAvgRiskScore) * 100) : 0;

  // Calculate anomalies (all events)
  const currentAnomalies = currentPeriodAlerts.length;
  const previousAnomalies = previousPeriodAlerts.length;
  const anomaliesChangePercent = previousAnomalies ? 
    Math.round(((currentAnomalies - previousAnomalies) / previousAnomalies) * 100) : 0;

  // Calculate severity distributions
  const severityDistribution = {
    critical: currentPeriodAlerts.filter(alert => alert.rule_level === 'critical').length,
    high: currentPeriodAlerts.filter(alert => alert.rule_level === 'high').length,
    medium: currentPeriodAlerts.filter(alert => alert.rule_level === 'medium').length,
    low: currentPeriodAlerts.filter(alert => alert.rule_level === 'low').length
  };

  // Calculate unique IPs
  const uniqueIPs = new Set(currentPeriodAlerts.map(alert => alert.ip_address).filter(Boolean));

  return {
    uniqueUsers: {
      current: currentUniqueUsers.size,
      change: userChangePercent,
      users: Array.from(currentUniqueUsers)
    },
    uniqueComputers: {
      current: currentUniqueComputers.size,
      change: computerChangePercent,
      computers: Array.from(currentUniqueComputers)
    },
    riskScore: {
      current: currentAvgRiskScore,
      change: riskScoreChangePercent
    },
    anomalies: {
      current: currentAnomalies,
      change: anomaliesChangePercent
    },
    severity: severityDistribution,
    uniqueIPs: uniqueIPs.size,
    totalEvents: currentPeriodAlerts.length,
    totalAnomalies: currentAnomalies
  };
};