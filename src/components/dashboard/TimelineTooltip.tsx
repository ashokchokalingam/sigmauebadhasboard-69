import React from 'react';

const TimelineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 shadow-xl">
      <p className="text-gray-400 text-xs mb-2">{label}</p>
      {payload.map((item: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-400">{item.name}:</span>
          <span className="text-white font-medium">
            {item.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TimelineTooltip;