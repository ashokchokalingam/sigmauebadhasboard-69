interface DetailSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const DetailSection = ({ title, icon, children, className = "" }: DetailSectionProps) => {
  return (
    <div className={`bg-purple-400/5 rounded-lg p-4 border border-purple-400/20 ${className}`}>
      <h3 className="text-sm font-medium text-purple-200 mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
};

export default DetailSection;