import React from "react";
import { Computer, User } from "lucide-react";

interface EntityCardIconProps {
  isComputer: boolean;
}

const EntityCardIcon = ({ isComputer }: EntityCardIconProps) => {
  return (
    <div className="relative w-12 h-12 rounded-full bg-[#5856D6]/10 flex items-center justify-center border border-[#5856D6]/20">
      {isComputer ? (
        <Computer className="w-6 h-6 text-[#9b87f5]" />
      ) : (
        <User className="w-6 h-6 text-[#9b87f5]" />
      )}
    </div>
  );
};

export default EntityCardIcon;