
import { Server } from "lucide-react";
import { BaseIconCell } from "./BaseIconCell";

interface ServerInfoCellProps {
  text: string;
  isBold?: boolean;
}

export const ServerInfoCell = ({ text, isBold }: ServerInfoCellProps) => (
  <BaseIconCell icon={Server} text={text} isBold={isBold} />
);
