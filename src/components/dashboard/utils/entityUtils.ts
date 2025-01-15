export const getUniqueEntities = (
  type: "users-origin" | "users-impacted" | "computers",
  impactedUsers: any[],
  originUsers: any[],
  impactedComputers: any[]
) => {
  switch (type) {
    case "users-origin":
      return (originUsers || []).map((user: any) => ({
        id: user.user_origin,
        eventCount: 1,
        uniqueTitles: user.unique_titles,
        total_unique_risk_score: user.total_unique_risk_score
      }));
    case "users-impacted":
      return (impactedUsers || []).map((user: any) => ({
        id: user.user_impacted,
        eventCount: 1,
        uniqueTitles: user.unique_titles,
        total_unique_risk_score: user.total_unique_risk_score
      }));
    case "computers":
      return (impactedComputers || []).map((computer: any) => ({
        id: computer.computer_name,
        eventCount: 1,
        uniqueTitles: computer.unique_titles,
        total_unique_risk_score: computer.total_unique_risk_score
      }));
    default:
      return [];
  }
};