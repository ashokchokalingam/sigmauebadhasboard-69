
import { Shield, Activity, CircleDot, KeyRound, Box } from "lucide-react";

interface TacticIconProps {
  tactic: string;
}

export const TacticIcon = ({ tactic }: TacticIconProps) => {
  const normalizedTactic = tactic.toLowerCase().trim();
  
  switch (normalizedTactic) {
    case 'initial_access':
    case 'initial-access':
      return <Shield className="w-4 h-4" />;
    case 'execution':
      return <Activity className="w-4 h-4" />;
    case 'privilege_escalation':
    case 'privilege-escalation':
      return <KeyRound className="w-4 h-4" />;
    case 'persistence':
      return <Box className="w-4 h-4" />;
    case 'credential_access':
    case 'credential-access':
      return <KeyRound className="w-4 h-4" />;
    default:
      console.log('Unknown tactic:', tactic);
      return <CircleDot className="w-4 h-4" />;
  }
};
