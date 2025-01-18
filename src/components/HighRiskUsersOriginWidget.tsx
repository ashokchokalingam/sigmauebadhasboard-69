import HighRiskWidget from "./widgets/HighRiskWidget";

const HighRiskUsersOriginWidget = () => {
  return (
    <HighRiskWidget
      entityType="userOrigin"
      title="High Risk Users Origin"
      apiEndpoint="user_origin_outlier_highrisk"
      searchPlaceholder="Search critical users..."
    />
  );
};

export default HighRiskUsersOriginWidget;