import { Alert } from "./types";

export const getFilteredAlerts = (
  alerts: Alert[],
  selectedSeverity: string | null,
  selectedTactic: string | null
) => {
  if (!Array.isArray(alerts)) {
    console.warn('Alerts is not an array:', alerts);
    return [];
  }

  return alerts.filter(alert => {
    if (selectedSeverity && alert?.rule_level !== selectedSeverity) {
      return false;
    }
    if (selectedTactic && !alert?.tags?.toLowerCase().includes(selectedTactic.toLowerCase())) {
      return false;
    }
    return true;
  });
};

export const calculateStats = (alerts: Alert[]) => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

  const currentPeriodAlerts = alerts.filter(alert => 
    new Date(alert.system_time) >= twentyFourHoursAgo
  );

  const previousPeriodAlerts = alerts.filter(alert => 
    new Date(alert.system_time) >= fortyEightHoursAgo &&
    new Date(alert.system_time) < twentyFourHoursAgo
  );

  // Calculate unique users
  const currentUniqueUsers = new Set(currentPeriodAlerts.map(alert => alert.user_id));
  const previousUniqueUsers = new Set(previousPeriodAlerts.map(alert => alert.user_id));
  const userChangePercent = previousUniqueUsers.size ? 
    Math.round(((currentUniqueUsers.size - previousUniqueUsers.size) / previousUniqueUsers.size) * 100) : 0;

  // Calculate risk scores
  const calculateAvgRiskScore = (alertsList: Alert[]) => {
    if (alertsList.length === 0) return 0;
    const totalRiskScore = alertsList.reduce((acc, alert) => 
      acc + (alert.rule_level === 'critical' ? 100 : 
        alert.rule_level === 'high' ? 75 : 
        alert.rule_level === 'medium' ? 50 : 25), 0
    );
    return Math.round(totalRiskScore / alertsList.length);
  };

  const currentAvgRiskScore = calculateAvgRiskScore(currentPeriodAlerts);
  const previousAvgRiskScore = calculateAvgRiskScore(previousPeriodAlerts);
  const riskScoreChangePercent = previousAvgRiskScore ? 
    Math.round(((currentAvgRiskScore - previousAvgRiskScore) / previousAvgRiskScore) * 100) : 0;

  // Calculate anomalies
  const currentAnomalies = currentPeriodAlerts.filter(alert => 
    alert.rule_level === 'critical' || alert.dbscan_cluster === -1
  ).length;
  const previousAnomalies = previousPeriodAlerts.filter(alert => 
    alert.rule_level === 'critical' || alert.dbscan_cluster === -1
  ).length;
  const anomaliesChangePercent = previousAnomalies ? 
    Math.round(((currentAnomalies - previousAnomalies) / previousAnomalies) * 100) : 0;

  return {
    uniqueUsers: {
      current: currentUniqueUsers.size,
      change: userChangePercent,
      users: Array.from(currentUniqueUsers)
    },
    riskScore: {
      current: currentAvgRiskScore,
      change: riskScoreChangePercent
    },
    anomalies: {
      current: currentAnomalies,
      change: anomaliesChangePercent
    }
  };
};