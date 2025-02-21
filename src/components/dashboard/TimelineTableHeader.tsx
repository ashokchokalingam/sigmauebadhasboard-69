
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const TimelineTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-8 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10" />
        <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
          Time
        </TableHead>
        <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
          Event ID
        </TableHead>
        <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
          Title
        </TableHead>
        <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
          Computer Name
        </TableHead>
        <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
          Provider Name
        </TableHead>
        <TableHead className="whitespace-nowrap px-4 py-3 header-gradient text-indigo-300 font-semibold border-b border-indigo-500/10">
          Risk Level
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TimelineTableHeader;
