import HighRiskWidget from "./widgets/HighRiskWidget";

const HighRiskUsersImpactedWidget = () => {
  return (
    <HighRiskWidget
      entityType="userImpacted"
      title="High Risk Users Impacted"
      apiEndpoint="user_impacted_outlier_highrisk"
      searchPlaceholder="Search critical users..."
    />
  );
};

export default HighRiskUsersImpactedWidget;