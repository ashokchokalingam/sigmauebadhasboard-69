import HighRiskWidget from "./high-risk/HighRiskWidget";

const HighRiskUsersOriginWidget = () => {
  return (
    <HighRiskWidget
      title="High Risk Users Origin"
      entityType="user-origin"
      endpoint="/api/user_origin_outlier_highrisk"
      dataKey="user_origin_outlier_highrisk_logs"
      showMetricCycle={true}
    />
  );
};

export default HighRiskUsersOriginWidget;