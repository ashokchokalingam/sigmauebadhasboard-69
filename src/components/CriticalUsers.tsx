import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Skull } from "lucide-react";
import UserTimeline, { TimelineEvent } from "./UserTimeline";

interface CriticalUser {
  user: string;
  tactics: string[];
  risk: number;
}

type TimelineEvents = {
  readonly [K in "admin.system" | "service.account" | "db.admin"]: ReadonlyArray<TimelineEvent>;
};

const mockTimelineEvents: TimelineEvents = {
  "admin.system": [
    {
      time: "10:45:23",
      event: "Attempted privilege escalation through kernel exploit",
      severity: "critical",
      tactic: "Privilege Escalation"
    },
    {
      time: "10:43:12",
      event: "Modified system binaries",
      severity: "critical",
      tactic: "Defense Evasion"
    },
    {
      time: "10:40:55",
      event: "Suspicious PowerShell execution",
      severity: "high",
      tactic: "Execution"
    }
  ],
  "service.account": [
    {
      time: "11:20:15",
      event: "Unauthorized access to production database",
      severity: "critical",
      tactic: "Initial Access"
    },
    {
      time: "11:15:30",
      event: "Multiple failed authentication attempts",
      severity: "high",
      tactic: "Credential Access"
    }
  ],
  "db.admin": [
    {
      time: "09:55:43",
      event: "Mass data exfiltration detected",
      severity: "critical",
      tactic: "Exfiltration"
    },
    {
      time: "09:50:18",
      event: "Unusual database query patterns",
      severity: "high",
      tactic: "Discovery"
    }
  ]
};

interface CriticalUsersProps {
  users: CriticalUser[];
}

const CriticalUsers = ({ users }: CriticalUsersProps) => {
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
                <UserTimeline 
                  username={user.user} 
                  events={mockTimelineEvents[user.user as keyof typeof mockTimelineEvents]} 
                />
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalUsers;