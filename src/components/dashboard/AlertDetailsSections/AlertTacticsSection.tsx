import { Card } from "@/components/ui/card";

interface AlertTacticsSectionProps {
  tags: string;
}

const AlertTacticsSection = ({ tags }: AlertTacticsSectionProps) => {
  const tactics = tags.split(',')
    .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
    .map(tag => tag.replace('attack.', ''))
    .map(tactic => tactic.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '));

  const techniques = tags.split(',')
    .filter(tag => tag.toLowerCase().includes('t1'))
    .map(tag => tag.trim().toUpperCase());

  return (
    <Card className="bg-[#2D2D44] border-[#4D4D64] p-4">
      <h3 className="text-lg font-semibold text-purple-300 mb-3">MITRE ATT&CK</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-purple-200 mb-2">Tactics</h4>
          <div className="flex flex-wrap gap-2">
            {tactics.map((tactic, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
              >
                {tactic}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-purple-200 mb-2">Techniques</h4>
          <div className="flex flex-wrap gap-2">
            {techniques.map((technique, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
              >
                {technique}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AlertTacticsSection;