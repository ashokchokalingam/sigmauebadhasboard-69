import HighRiskWidget from "./high-risk/HighRiskWidget";

const HighRiskUsersImpactedWidget = () => {
  return (
    <HighRiskWidget
      title="High Risk Users Impacted"
      entityType="user-impacted"
      endpoint="/api/user_impacted_outlier_highrisk"
      dataKey="user_impacted_outlier_highrisk_logs"
    />
  );
};

export default HighRiskUsersImpactedWidget;