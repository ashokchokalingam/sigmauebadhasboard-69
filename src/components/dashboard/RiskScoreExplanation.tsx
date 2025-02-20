
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RiskScoreExplanationProps {
  score: number;
  tactics?: string[];
  techniques?: string[];
}

const RiskScoreExplanation = ({ score, tactics = [], techniques = [] }: RiskScoreExplanationProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="inline-flex items-center gap-2">
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="cursor-help">
            {score.toFixed(1)}
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 bg-[#0A0B0F]/90 border border-[#5856D6]/20 backdrop-blur-xl">
          <p className="text-sm text-[#D6BCFA]">
            Risk score is based on MITRE ATT&CK tactics and techniques. Click for details.
          </p>
        </HoverCardContent>
      </HoverCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-5 w-5 rounded-full hover:bg-blue-500/10"
          >
            <Info className="h-4 w-4 text-blue-400" />
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="sm:max-w-[600px] bg-[#0A0B0F] border-[#5856D6]/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-blue-100">
                📌 What is Risk Score?
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <p className="text-blue-200">
                The risk score is calculated based on MITRE ATT&CK tactics and techniques linked to an event. 
                Each tactic and technique contributes to the final score.
              </p>

              <div>
                <h4 className="text-lg font-medium text-blue-100 mb-2">✅ How is it calculated?</h4>
                <ul className="space-y-2 text-blue-200">
                  <li>• Each tactic has a base score (e.g., Initial Access = 10, Persistence = 7)</li>
                  <li>• Each technique adds an additional weight (e.g., T1133 = +5, T1078 = +3)</li>
                  <li>• The system assigns a combined risk score based on all factors</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium text-blue-100 mb-2">📊 Current Score Breakdown</h4>
                <div className="rounded-lg border border-[#5856D6]/20 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#5856D6]/10 border-b border-[#5856D6]/20">
                        <th className="px-4 py-2 text-left text-sm font-medium text-blue-300">Tactic</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-blue-300">Base Score</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-blue-300">Technique</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-blue-300">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tactics.map((tactic, index) => (
                        <tr key={index} className="border-b border-[#5856D6]/10 last:border-0">
                          <td className="px-4 py-2 text-sm text-blue-200">{tactic}</td>
                          <td className="px-4 py-2 text-sm text-blue-200">
                            {getBaseScore(tactic)}
                          </td>
                          <td className="px-4 py-2 text-sm text-blue-200">
                            {techniques[index] || '-'}
                          </td>
                          <td className="px-4 py-2 text-sm text-blue-200">
                            +{getTechniqueScore(techniques[index])}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[#5856D6]/5">
                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-blue-300">
                          Final Risk Score
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-blue-300">
                          {score.toFixed(1)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#5856D6]/5 p-4 rounded-lg">
                <p className="text-sm text-blue-300">
                  🔍 Learn more about our risk scoring system in the 
                  <a 
                    href="/docs/risk-scoring" 
                    className="text-[#5856D6] hover:text-[#5856D6]/80 ml-1"
                  >
                    documentation
                  </a>.
                </p>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

// Helper functions for score calculation
const getBaseScore = (tactic: string): number => {
  const scores: Record<string, number> = {
    'Initial Access': 10,
    'Persistence': 7,
    'Privilege Escalation': 12,
    'Defense Evasion': 8,
    'Credential Access': 10,
    'Lateral Movement': 12
  };
  return scores[tactic] || 5;
};

const getTechniqueScore = (technique?: string): number => {
  if (!technique) return 0;
  const scores: Record<string, number> = {
    'T1133': 5,
    'T1098': 3,
    'T1078': 3,
    'T1070.001': 4,
    'T1110': 5,
    'T1021.002': 6
  };
  return scores[technique] || 2;
};

export default RiskScoreExplanation;
