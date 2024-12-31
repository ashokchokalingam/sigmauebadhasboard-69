import { LucideIcon } from "lucide-react";

interface MetadataFieldProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null;
}

const MetadataField = ({ icon: Icon, label, value }: MetadataFieldProps) => {
  // Always show the field, even if value is null/empty
  return (
    <div className="flex items-start gap-3 p-3 bg-sidebar/20 rounded-lg">
      <Icon className="h-5 w-5 text-blue-400 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-blue-400">{label}</p>
        <p className="text-sm text-blue-100 font-mono break-all">
          {value === null || value === undefined || value === '' ? 'N/A' : 
           typeof value === 'object' ? JSON.stringify(value) : value}
        </p>
      </div>
    </div>
  );
};

export default MetadataField;