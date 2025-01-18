import HighRiskWidget from "./high-risk/HighRiskWidget";

const HighRiskAssetsWidget = () => {
  return (
    <HighRiskWidget
      title="High Risk Assets"
      entityType="asset"
      endpoint="/api/computer_impacted_outlier_highrisk"
      dataKey="computer_impacted_outlier_highrisk_logs"
      showMetricCycle={true}
    />
  );
};

export default HighRiskAssetsWidget;