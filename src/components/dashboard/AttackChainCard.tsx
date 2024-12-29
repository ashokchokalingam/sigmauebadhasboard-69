import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield } from "lucide-react";

const AttackChainCard = () => {
  return (
    <Card className="bg-black/40 border-green-500/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-100">
          <Shield className="h-5 w-5 text-green-500" />
          Attack Chain Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex flex-col items-center">
            <div className="w-32 p-2 bg-purple-900/30 rounded-lg border border-purple-500/20 text-center">
              <p className="text-purple-200">Initial Access</p>
              <p className="text-xs text-purple-400 mt-1">T1078</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-green-500" />
          <div className="flex flex-col items-center">
            <div className="w-32 p-2 bg-blue-900/30 rounded-lg border border-blue-500/20 text-center">
              <p className="text-blue-200">Execution</p>
              <p className="text-xs text-blue-400 mt-1">T1059</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-green-500" />
          <div className="flex flex-col items-center">
            <div className="w-32 p-2 bg-red-900/30 rounded-lg border border-red-500/20 text-center">
              <p className="text-red-200">Persistence</p>
              <p className="text-xs text-red-400 mt-1">T1547</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttackChainCard;