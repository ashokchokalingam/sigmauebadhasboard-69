
interface TimelineDetailCardProps {
  header: string;
  value: string | number | null | undefined;
  className?: string;
}

const TimelineDetailCard = ({ header, value, className = "" }: TimelineDetailCardProps) => {
  return (
    <div className={`detail-card p-4 ${className}`}>
      <div className="detail-header">{header}</div>
      <div className="detail-value">{value || 'N/A'}</div>
    </div>
  );
};

export default TimelineDetailCard;
