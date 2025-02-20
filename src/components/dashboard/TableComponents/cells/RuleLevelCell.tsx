
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RuleLevelCellProps {
  level: string;
}

export const RuleLevelCell = ({ level }: RuleLevelCellProps) => (
  <div className="flex items-center gap-3">
    <AlertTriangle className="h-4 w-4 text-blue-400/80 flex-shrink-0" />
    <Badge 
      variant="outline" 
      className="bg-blue-500/10 text-blue-300 border-blue-500/20 px-3 py-1"
    >
      {level || 'Unknown'}
    </Badge>
  </div>
);
