import { format } from 'date-fns';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const TimelineTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const date = new Date(label);

  return (
    <div className="bg-black/90 border border-blue-500/20 rounded-lg p-3 shadow-xl">
      <p className="text-gray-400 text-sm mb-2">
        {format(date, 'MMM dd, yyyy HH:mm')}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-gray-400 capitalize">{entry.dataKey}:</span>
          <span className="text-blue-400">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default TimelineTooltip;