import { ExternalLink } from "lucide-react";

const TimelineMitreSummary = () => {
  return (
    <a
      href="https://attack.mitre.org/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-full 
        bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white shadow-lg 
        hover:from-purple-600/90 hover:to-blue-600/90 
        transition-all duration-300 hover:scale-105 hover:shadow-xl
        border border-white/20 backdrop-blur-sm
        animate-pulse hover:animate-none"
    >
      <span>MITRE ATT&CK</span>
      <ExternalLink className="w-5 h-5 animate-bounce" />
    </a>
  );
};

export default TimelineMitreSummary;