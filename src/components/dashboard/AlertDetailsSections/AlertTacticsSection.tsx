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
    <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
      <h3 className="text-lg font-semibold text-[#7B68EE] mb-3">MITRE ATT&CK</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9] mb-2">Tactics</h4>
          <div className="flex flex-wrap gap-2">
            {tactics.map((tactic, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-[#7B68EE]/10 text-[#7B68EE] text-xs rounded-full border border-[#7B68EE]/20"
              >
                {tactic}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#A9A9A9] mb-2">Techniques</h4>
          <div className="flex flex-wrap gap-2">
            {techniques.map((technique, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-[#7B68EE]/10 text-[#7B68EE] text-xs rounded-full border border-[#7B68EE]/20"
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