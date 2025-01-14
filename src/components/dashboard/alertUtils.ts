import { Alert, Stats } from "./types";

export const calculateStats = (alerts: Alert[], totalRecords: number): Stats => {
  const stats: Stats = {
    total: totalRecords,
    high: 0,
    medium: 0,
    low: 0,
    lastDay: 0,
    totalEvents: alerts.length,
    severity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      informational: 0
    },
    uniqueUsers: {
      current: 0,
      users: []
    },
    uniqueComputers: {
      current: 0,
      computers: []
    },
    anomalies: {
      current: 0
    }
  };

  // Calculate severity counts
  alerts.forEach(alert => {
    if (alert.rule_level === "critical" || (typeof alert.ml_cluster === 'number' && alert.ml_cluster === -1)) {
      stats.severity.critical++;
    } else if (alert.rule_level === "high") {
      stats.severity.high++;
    } else if (alert.rule_level === "medium") {
      stats.severity.medium++;
    } else if (alert.rule_level === "low") {
      stats.severity.low++;
    } else {
      stats.severity.informational++;
    }
  });

  // Calculate unique users
  const uniqueUsers = new Set(alerts.map(alert => alert.user_id).filter(Boolean));
  stats.uniqueUsers.current = uniqueUsers.size;
  stats.uniqueUsers.users = Array.from(uniqueUsers).map(id => ({
    id: id as string,
    risk_score: 0
  }));

  // Calculate unique computers
  const uniqueComputers = new Set(alerts.map(alert => alert.computer_name).filter(Boolean));
  stats.uniqueComputers.current = uniqueComputers.size;
  stats.uniqueComputers.computers = Array.from(uniqueComputers) as string[];

  // Calculate anomalies
  stats.anomalies.current = alerts.filter(alert => 
    typeof alert.ml_cluster === 'number' && alert.ml_cluster === -1
  ).length;

  return stats;
};