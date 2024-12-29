import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

const SystemHealthCard = () => {
  return (
    <Card className="bg-black/40 border-orange-500/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-100">
          <Activity className="h-5 w-5 text-orange-500" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-orange-200">CPU Usage</span>
              <span className="text-sm text-orange-400">45%</span>
            </div>
            <div className="h-2 bg-orange-950/30 rounded-full">
              <div className="h-full w-[45%] bg-gradient-to-r from-orange-600 to-orange-400 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-orange-200">Memory</span>
              <span className="text-sm text-orange-400">60%</span>
            </div>
            <div className="h-2 bg-orange-950/30 rounded-full">
              <div className="h-full w-[60%] bg-gradient-to-r from-orange-600 to-orange-400 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-orange-200">Network</span>
              <span className="text-sm text-orange-400">30%</span>
            </div>
            <div className="h-2 bg-orange-950/30 rounded-full">
              <div className="h-full w-[30%] bg-gradient-to-r from-orange-600 to-orange-400 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthCard;