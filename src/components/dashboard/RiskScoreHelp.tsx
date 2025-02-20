
import React from "react";
import { HelpCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RiskScoreHelp = () => {
  const tacticsData = [
    { tactic: "Initial Access", base: 10, technique: 5, description: "How threat actors gain entry" },
    { tactic: "Execution", base: 8, technique: 4, description: "Running malicious code" },
    { tactic: "Persistence", base: 7, technique: 3, description: "Maintaining access" },
    { tactic: "Privilege Escalation", base: 12, technique: 6, description: "Gaining higher-level permissions" },
    { tactic: "Defense Evasion", base: 9, technique: 4, description: "Avoiding detection" },
    { tactic: "Credential Access", base: 10, technique: 5, description: "Stealing account credentials" },
    { tactic: "Discovery", base: 6, technique: 3, description: "Exploring the network" },
    { tactic: "Lateral Movement", base: 11, technique: 5, description: "Moving through network" },
    { tactic: "Collection", base: 8, technique: 4, description: "Gathering sensitive data" },
    { tactic: "Command & Control", base: 12, technique: 6, description: "Remote communication" },
    { tactic: "Exfiltration", base: 11, technique: 5, description: "Stealing data" },
    { tactic: "Impact", base: 12, technique: 6, description: "Disrupting business operations" }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-purple-500/10 hover:text-purple-400"
        >
          <HelpCircle className="h-5 w-5 text-purple-400/70" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#1a1f2c] border border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-300">
            Understanding Risk Score Calculation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-200">How Risk Scores Work</h3>
            <p className="text-gray-300">
              Risk scores are calculated using the MITRE ATT&CK framework, which maps adversary tactics and techniques. 
              The score helps security analysts prioritize threats based on:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-300">
              <li>Severity of detected tactics</li>
              <li>Number of unique techniques observed</li>
              <li>Historical pattern analysis</li>
              <li>Temporal correlation of events</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-200">Calculation Method</h3>
            <p className="text-gray-300">
              Each MITRE ATT&CK tactic and technique contributes to the final risk score:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-300">
              <li>Base scores for tactics (indicating overall severity)</li>
              <li>Additional points for specific techniques used</li>
              <li>Multipliers for multiple techniques in the same tactic</li>
              <li>Time-based decay for older events</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-200">MITRE ATT&CK Scoring Matrix</h3>
            <div className="rounded-md border border-purple-500/20">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-purple-500/5">
                    <TableHead className="text-purple-300">Tactic</TableHead>
                    <TableHead className="text-purple-300">Base Score</TableHead>
                    <TableHead className="text-purple-300">Technique Score</TableHead>
                    <TableHead className="text-purple-300 hidden md:table-cell">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tacticsData.map((item, index) => (
                    <TableRow 
                      key={index}
                      className="hover:bg-purple-500/5"
                    >
                      <TableCell className="font-medium text-purple-200">{item.tactic}</TableCell>
                      <TableCell className="text-amber-400">{item.base}</TableCell>
                      <TableCell className="text-amber-400">+{item.technique}</TableCell>
                      <TableCell className="text-gray-400 hidden md:table-cell">{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-200">Risk Level Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="font-semibold text-red-400">Critical (150+)</div>
                <div className="text-sm text-gray-300">Immediate investigation required</div>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="font-semibold text-orange-400">High (100-149)</div>
                <div className="text-sm text-gray-300">Prioritize for investigation</div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="font-semibold text-yellow-400">Medium (50-99)</div>
                <div className="text-sm text-gray-300">Monitor and investigate as resources allow</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="font-semibold text-green-400">Low (0-49)</div>
                <div className="text-sm text-gray-300">Review during routine analysis</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-200 mb-2">Example Calculation</h3>
            <p className="text-gray-300 mb-2">For an event with:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-300">
              <li>Initial Access (Base: 10 + Technique: 5)</li>
              <li>Privilege Escalation (Base: 12 + Technique: 6)</li>
              <li>Multiple techniques multiplier: 1.2x</li>
            </ul>
            <p className="mt-2 font-semibold text-purple-300">
              Final Score: (15 + 18) × 1.2 = 39.6
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RiskScoreHelp;
