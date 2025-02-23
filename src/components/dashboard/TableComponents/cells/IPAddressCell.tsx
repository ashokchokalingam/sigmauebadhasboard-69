
import { Network } from "lucide-react";

interface IPAddressCellProps {
  ipAddress: string;
}

export const IPAddressCell = ({ ipAddress }: IPAddressCellProps) => (
  <div className="flex items-center gap-2">
    <Network className="h-4 w-4 text-blue-400/80 flex-shrink-0" />
    <code className="font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">
      {ipAddress === '-' ? 'none' : ipAddress}
    </code>
  </div>
);
