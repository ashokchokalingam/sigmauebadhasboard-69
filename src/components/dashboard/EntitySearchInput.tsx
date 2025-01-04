import { Input } from "@/components/ui/input";

interface EntitySearchInputProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const EntitySearchInput = ({ searchQuery, onSearchChange }: EntitySearchInputProps) => {
  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search entities..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-black/20 border-blue-500/20 text-blue-100 placeholder:text-blue-400/50"
      />
    </div>
  );
};

export default EntitySearchInput;