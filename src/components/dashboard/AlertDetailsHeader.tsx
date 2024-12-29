import { Card, CardContent } from "@/components/ui/card";

interface AlertDetailsHeaderProps {
  title: string;
  ruleId: string;
  severity: string;
}

const AlertDetailsHeader = ({ title, ruleId, severity }: AlertDetailsHeaderProps) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <Card className="bg-purple-950/20 border-purple-500/10">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-purple-400 mb-1">Title</h4>
          <p className="text-lg text-purple-100">{title}</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-purple-950/20 border-purple-500/10">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-purple-400 mb-1">Rule ID</h4>
            <p className="text-sm text-purple-100 font-mono break-all">{ruleId}</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-950/20 border-purple-500/10">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-purple-400 mb-1">Severity</h4>
            <p className="text-lg text-purple-100 capitalize">{severity}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertDetailsHeader;