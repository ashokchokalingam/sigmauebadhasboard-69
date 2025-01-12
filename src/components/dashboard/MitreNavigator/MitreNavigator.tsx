import { useEffect, useState } from 'react';
import { Alert } from '../types';
import { Shield, Info } from 'lucide-react';

interface MitreNavigatorProps {
  events?: Alert[];
}

interface TacticData {
  name: string;
  techniques: {
    id: string;
    name: string;
    count: number;
    description: string;
  }[];
}

const MitreNavigator = ({ events = [] }: MitreNavigatorProps) => {
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);

  const tactics: TacticData[] = [
    {
      name: "Initial Access",
      techniques: [
        { id: "T1133", name: "External Remote Services", count: 0, description: "Adversaries may leverage external-facing remote services to initially access and/or persist within a network." },
        { id: "T1078", name: "Valid Accounts", count: 0, description: "Adversaries may obtain and abuse credentials of existing accounts as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion." },
      ]
    },
    {
      name: "Execution",
      techniques: [
        { id: "T1059", name: "Command and Scripting Interpreter", count: 0, description: "Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries." },
        { id: "T1204", name: "User Execution", count: 0, description: "An adversary may rely upon specific actions by a user in order to gain execution." },
      ]
    },
    {
      name: "Persistence",
      techniques: [
        { id: "T1098", name: "Account Manipulation", count: 0, description: "Adversaries may manipulate accounts to maintain access to victim systems." },
        { id: "T1136", name: "Create Account", count: 0, description: "Adversaries may create accounts to maintain access to victim systems." },
      ]
    },
    {
      name: "Privilege Escalation",
      techniques: [
        { id: "T1548", name: "Abuse Elevation Control Mechanism", count: 0, description: "Adversaries may abuse elevation control mechanisms that are intended to allow only privileged users to perform certain actions." },
        { id: "T1134", name: "Access Token Manipulation", count: 0, description: "Adversaries may modify access tokens to operate under a different user or system security context to perform actions and evade detection." },
      ]
    },
    {
      name: "Defense Evasion",
      techniques: [
        { id: "T1070", name: "Indicator Removal", count: 0, description: "Adversaries may delete or modify artifacts generated within systems to remove evidence of their presence." },
        { id: "T1562", name: "Impair Defenses", count: 0, description: "Adversaries may maliciously modify components of a victim environment to hinder or disable defensive mechanisms." },
      ]
    },
  ];

  // Count techniques from events
  useEffect(() => {
    if (!events?.length) return;

    events.forEach(event => {
      const techniques = event.tags
        ?.split(',')
        .filter(tag => tag.toLowerCase().includes('t1'))
        .map(tag => tag.trim().toUpperCase());

      techniques?.forEach(techniqueId => {
        tactics.forEach(tactic => {
          const technique = tactic.techniques.find(t => t.id === techniqueId);
          if (technique) {
            technique.count++;
          }
        });
      });
    });
  }, [events]);

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-gray-800';
    if (count <= 2) return 'bg-purple-900/50';
    if (count <= 5) return 'bg-purple-700/60';
    return 'bg-purple-500/70';
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Shield className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            MITRE ATT&CK® Navigator
          </h1>
        </div>

        <div className="grid gap-6">
          {tactics.map((tactic) => (
            <div 
              key={tactic.name}
              className="bg-black/40 border border-purple-500/10 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-purple-300 mb-4">{tactic.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tactic.techniques.map((technique) => (
                  <div
                    key={technique.id}
                    className={`${getHeatmapColor(technique.count)} border border-purple-500/20 rounded-lg p-4 cursor-pointer
                      hover:border-purple-500/40 transition-all duration-300 group relative`}
                    onClick={() => setSelectedTechnique(technique.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-purple-300 font-mono mb-1">
                          {technique.id}
                        </div>
                        <div className="text-base font-medium text-white">
                          {technique.name}
                        </div>
                      </div>
                      <div className="bg-purple-500/20 px-2 py-1 rounded text-sm">
                        {technique.count}
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/90 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-purple-400 flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-300">
                          {technique.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MitreNavigator;