import HighRiskWidget from "./widgets/HighRiskWidget";

const HighRiskComputersWidget = () => {
  return (
    <HighRiskWidget
      entityType="computer"
      title="High Risk Computers"
      apiEndpoint="computer_impacted_outlier_highrisk"
      searchPlaceholder="Search critical computers..."
    />
  );
};

export default HighRiskComputersWidget;