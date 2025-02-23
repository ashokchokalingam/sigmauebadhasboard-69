
import { Shield, Activity, CircleDot } from "lucide-react";

interface TacticIconProps {
  tactic: string;
}

export const TacticIcon = ({ tactic }: TacticIconProps) => {
  switch (tactic?.toLowerCase()) {
    case 'initial_access':
    case 'initial-access':
      return <Shield className="w-4 h-4" />;
    case 'execution':
      return <Activity className="w-4 h-4" />;
    default:
      return <CircleDot className="w-4 h-4" />;
  }
};
