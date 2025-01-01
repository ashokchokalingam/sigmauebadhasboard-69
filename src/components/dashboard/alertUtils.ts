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
        change: 0,
        users: []
      },
      uniqueComputers: {
        current: 0,
        change: 0,
        computers: []
      },
      uniqueIPs: 0,
      riskScore: {
        current: 0,
        change: 0
      },
      anomalies: {
        current: 0,
        change: 0
      }
    };
  }

  const severityCounts = alerts.reduce((acc, alert) => {
    const severity = alert.severity?.toLowerCase() || 'low';
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueUsers = Array.from(new Set(alerts.map(alert => alert.user_id)));
  const uniqueComputers = Array.from(new Set(alerts.map(alert => alert.computer_name)));
  const uniqueIPs = new Set(alerts.map(alert => alert.ip_address)).size;

  const riskScore = alerts.reduce((acc, alert) => acc + (alert.risk_score || 0), 0) / alerts.length || 0;
  const anomaliesCount = alerts.filter(alert => alert.is_anomaly).length;

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
      change: 0,
      users: uniqueUsers.filter(Boolean) as string[]
    },
    uniqueComputers: {
      current: uniqueComputers.length,
      change: 0,
      computers: uniqueComputers.filter(Boolean) as string[]
    },
    uniqueIPs: uniqueIPs,
    riskScore: {
      current: riskScore,
      change: 0
    },
    anomalies: {
      current: anomaliesCount,
      change: 0
    }
  };
};