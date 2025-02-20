
export const ChronoAnalyzerTableHeader = () => {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#0A0D14] text-sm font-medium text-slate-300 border-b border-slate-800">
      <div className="col-span-1">Time</div>
      <div className="col-span-1">User Origin</div>
      <div className="col-span-1">User Impacted</div>
      <div className="col-span-2">Title</div>
      <div className="col-span-2">Computer</div>
      <div className="col-span-2">Description</div>
      <div className="col-span-1">IP Address</div>
      <div className="col-span-1">Rule Level</div>
      <div className="col-span-1">Risk Score</div>
    </div>
  );
};
