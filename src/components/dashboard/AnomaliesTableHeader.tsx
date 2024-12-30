import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AnomaliesTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-blue-950/30">
        <TableHead className="text-blue-300">Time</TableHead>
        <TableHead className="text-blue-300">User</TableHead>
        <TableHead className="text-blue-300">Computer</TableHead>
        <TableHead className="text-blue-300">IP Address</TableHead>
        <TableHead className="text-blue-300">Title</TableHead>
        <TableHead className="text-blue-300">Tactics</TableHead>
        <TableHead className="text-blue-300">Techniques</TableHead>
        <TableHead className="text-blue-300">Risk Score</TableHead>
        <TableHead className="text-blue-300">Outlier</TableHead>
        <TableHead className="text-blue-300 w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AnomaliesTableHeader;