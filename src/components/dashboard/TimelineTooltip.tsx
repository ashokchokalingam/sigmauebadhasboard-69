import { format } from 'date-fns';

const TimelineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#0D1117] border border-blue-500/20 rounded-lg p-3 shadow-xl">
      <p className="text-sm text-gray-400 mb-2">
        {format(new Date(label), 'MMM dd, yyyy HH:mm')}
      </p>
      {payload.map((item: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <span className="text-sm text-gray-300">{item.name}</span>
          <span className="text-sm font-medium text-blue-400">
            {item.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TimelineTooltip;