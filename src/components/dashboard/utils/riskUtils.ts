
export const getRiskBadgeColor = (risk: number | null) => {
  if (!risk) return "bg-purple-500/10 text-purple-400";
  if (risk >= 80) return "bg-[#D32F2F]/10 text-[#D32F2F] font-semibold";
  if (risk >= 60) return "bg-[#FF6F00]/10 text-[#FF6F00] font-semibold";
  if (risk >= 40) return "bg-[#FFB300]/10 text-[#FFB300] font-semibold";
  return "bg-[#4CAF50]/10 text-[#4CAF50] font-semibold";
};

export const getRiskLabel = (risk: number | null) => {
  if (!risk) return "Unknown";
  if (risk >= 80) return "Critical";
  if (risk >= 60) return "High";
  if (risk >= 40) return "Medium";
  return "Low";
};
