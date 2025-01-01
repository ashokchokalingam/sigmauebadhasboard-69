import { Alert } from "./types";

export const calculateStats = (alerts: Alert[], totalRecords: number) => {
  if (!alerts || alerts.length === 0) {
    return {
      totalEvents: totalRecords,
      severity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      uniqueUsers: {
        current: 0,
        users: []
      },
      uniqueComputers: {
        current: 0,
        computers: []
      },
      uniqueIPs: 0,
      riskScore: {
        current: 0
      },
      anomalies: {
        current: 0
      }
    };
  }

  const severityCounts = alerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueUsers = Array.from(new Set(alerts.map(alert => alert.userId)));
  const uniqueComputers = Array.from(new Set(alerts.map(alert => alert.computerId)));
  const uniqueIPs = new Set(alerts.map(alert => alert.ip)).size;

  const riskScore = alerts.reduce((acc, alert) => acc + alert.riskScore, 0) / alerts.length || 0;
  const anomaliesCount = alerts.filter(alert => alert.isAnomaly).length;

  return {
    totalEvents: totalRecords,
    severity: {
      critical: severityCounts.critical || 0,
      high: severityCounts.high || 0,
      medium: severityCounts.medium || 0,
      low: severityCounts.low || 0
    },
    uniqueUsers: {
      current: uniqueUsers.length,
      users: uniqueUsers
    },
    uniqueComputers: {
      current: uniqueComputers.length,
      computers: uniqueComputers
    },
    uniqueIPs: uniqueIPs,
    riskScore: {
      current: riskScore
    },
    anomalies: {
      current: anomaliesCount
    }
  };
};
