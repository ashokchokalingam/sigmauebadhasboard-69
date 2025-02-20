
import { Network, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface IPAddressCellProps {
  ipAddress: string;
}

export const IPAddressCell = ({ ipAddress }: IPAddressCellProps) => {
  const { toast } = useToast();

  const handleCopyIP = (ip: string) => {
    navigator.clipboard.writeText(ip);
    toast({
      title: "IP Address copied",
      description: `${ip} has been copied to clipboard`,
      duration: 2000,
    });
  };

  return (
    <div className="flex items-center gap-2 group">
      <Network className="h-4 w-4 text-blue-400/80 flex-shrink-0" />
      <code className="font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">
        {ipAddress || '-'}
      </code>
      {ipAddress && (
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            handleCopyIP(ipAddress);
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
