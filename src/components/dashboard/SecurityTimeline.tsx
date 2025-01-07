import { Shield, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";

interface SecurityTimelineProps {
  events: Alert[];
  userName: string;
}

const SecurityTimeline = ({ events, userName }: SecurityTimelineProps) => {
  const getSeverityColor = (level: string = '') => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'text-red-400 bg-red-950/30 border-red-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-950/30 border-yellow-500/20';
      case 'low':
        return 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20';
      default:
        return 'text-blue-400 bg-blue-950/30 border-blue-500/20';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-8 bg-[#1a2234] p-6 rounded-lg border border-blue-500/10">
        <Shield className="h-8 w-8 text-blue-400" />
        <div>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {userName}
          </h2>
          <p className="text-lg text-blue-300/80 mt-2">Security Timeline Analysis</p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {events.map((event, index) => {
            const { tactics, techniques } = extractTacticsAndTechniques(event.tags);
            
            return (
              <Card 
                key={index}
                className="p-6 bg-[#1a2234] border-blue-500/10 relative"
              >
                <div className="flex items-start gap-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(event.rule_level)} capitalize`}>
                    {event.rule_level} • {event.total_events} events
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-blue-100 mt-4">
                  {event.title}
                </h3>
                
                <p className="text-blue-300/70 mt-2">
                  {event.description}
                </p>

                <div className="flex items-center gap-4 mt-4 text-sm text-blue-300/60">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>User Impacted: {event.user_impacted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>First seen: {formatDate(event.first_time_seen)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Last seen: {formatDate(event.last_time_seen)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-purple-400 mb-2">Tactics Identified</h4>
                    <div className="flex flex-wrap gap-2">
                      {tactics.split(',').map((tactic, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full border border-purple-500/20"
                        >
                          {tactic.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-blue-400 mb-2">Techniques Observed</h4>
                    <div className="flex flex-wrap gap-2">
                      {techniques.map((technique, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-500/10 text-blue-300 text-sm rounded-full border border-blue-500/20"
                        >
                          {technique}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SecurityTimeline;