import { Alert, Stats } from "./types";

export const calculateStats = (alerts: Alert[], totalRecords: number): Stats => {
  // Dummy data implementation
  return {
    totalEvents: totalRecords,
    severity: {
      critical: 25,
      high: 45,
      medium: 80,
      low: 150
    },
    uniqueUsers: {
      current: 156,
      change: 12,
      users: [
        { id: "john.doe", risk_score: 85 },
        { id: "jane.smith", risk_score: 92 },
        { id: "bob.wilson", risk_score: 75 },
        { id: "alice.johnson", risk_score: 88 }
      ]
    },
    uniqueComputers: {
      current: 89,
      change: -3,
      computers: ["DESKTOP-001", "LAPTOP-002", "SERVER-003"]
    },
    uniqueIPs: 234,
    riskScore: {
      current: 78,
      change: 5
    },
    anomalies: {
      current: 34,
      change: 8
    }
  };
};
