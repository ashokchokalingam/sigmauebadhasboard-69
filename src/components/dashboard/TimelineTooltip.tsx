import { format } from 'date-fns';

const TimelineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-black/90 border border-emerald-500/20 rounded-lg p-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">
        {format(new Date(label), 'MMM dd, yyyy HH:mm')}
      </p>
      {payload.map((item: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-3">
          <span className="text-emerald-400">{item.value.toLocaleString()} events</span>
        </div>
      ))}
    </div>
  );
};

export default TimelineTooltip;