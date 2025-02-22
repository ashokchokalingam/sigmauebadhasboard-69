
import { Card } from "@/components/ui/card";

interface AlertTacticsSectionProps {
  tags: string;
}

const AlertTacticsSection = ({ tags }: AlertTacticsSectionProps) => {
  if (!tags) {
    return (
      <Card className="bg-[#1E1E2F] border-[#5856D6]/30 p-6">
        <h3 className="text-2xl font-bold text-[#5856D6] mb-4">MITRE ATT&CK</h3>
        <p className="text-base text-[#E2E8F0]">No tactics or techniques available</p>
      </Card>
    );
  }

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
    <Card className="bg-[#1E1E2F] border-[#5856D6]/30 p-6">
      <h3 className="text-2xl font-bold text-[#5856D6] mb-6">MITRE ATT&CK</h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-[#E2E8F0] mb-3">Tactics</h4>
          <div className="flex flex-wrap gap-3">
            {tactics.length > 0 ? tactics.map((tactic, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-[#5856D6]/10 text-[#5856D6] text-base font-medium rounded-lg 
                  border border-[#5856D6]/30 hover:bg-[#5856D6]/20 transition-colors
                  shadow-[0_0_10px_rgba(88,86,214,0.1)]"
              >
                {tactic}
              </span>
            )) : (
              <span className="text-base text-[#E2E8F0]">No tactics found</span>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-[#E2E8F0] mb-3">Techniques</h4>
          <div className="flex flex-wrap gap-3">
            {techniques.length > 0 ? techniques.map((technique, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-[#5856D6]/10 text-[#5856D6] text-base font-medium rounded-lg 
                  border border-[#5856D6]/30 hover:bg-[#5856D6]/20 transition-colors
                  shadow-[0_0_10px_rgba(88,86,214,0.1)]"
              >
                {technique}
              </span>
            )) : (
              <span className="text-base text-[#E2E8F0]">No techniques found</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AlertTacticsSection;
