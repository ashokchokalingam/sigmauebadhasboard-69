import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Skull } from "lucide-react";

interface CriticalUser {
  user: string;
  tactics: string[];
  risk: number;
}

const CriticalUsers = ({ users }: { users: CriticalUser[] }) => {
  return (
    <Card className="bg-black/40 border-red-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-100">
          <Skull className="h-5 w-5 text-red-500" />
          Critical Users Under Attack
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {users.map((user, index) => (
            <Drawer key={index}>
              <DrawerTrigger className="w-full">
                <div className="p-4 bg-red-950/20 rounded-lg border border-red-900/30 hover:bg-red-950/30 transition-all duration-300 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-red-100">{user.user}</span>
                    <span className="text-red-500 font-bold">{user.risk}% Risk</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.tactics.map((tactic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-red-500/20 rounded text-xs text-red-200 border border-red-500/30"
                      >
                        {tactic}
                      </span>
                    ))}
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent className="bg-[#1A1F2C] border-red-900/20">
                <div className="p-4">
                  <h3 className="text-lg font-bold text-red-100 mb-4">User Details</h3>
                  <p className="text-red-200">User activity details will be shown here.</p>
                </div>
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalUsers;