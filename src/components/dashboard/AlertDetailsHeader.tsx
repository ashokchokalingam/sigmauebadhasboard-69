import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import { AlertTriangle, Shield } from "lucide-react";

interface AlertDetailsHeaderProps {
  alert: Alert;
}

const AlertDetailsHeader = ({ alert }: AlertDetailsHeaderProps) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <Card className="bg-purple-950/20 border-purple-500/10">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-purple-400 mb-1">Title</h4>
          <p className="text-2xl text-purple-100">{alert.title || 'N/A'}</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-purple-950/20 border-purple-500/10">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-purple-400 mb-1">Rule ID</h4>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <p className="text-sm text-purple-100 font-mono break-all">
                {alert.ruleid || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-950/20 border-purple-500/10">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-purple-400 mb-1">Severity</h4>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-purple-400" />
              <p className="text-xl text-purple-100 capitalize">
                {alert.rule_level || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertDetailsHeader;