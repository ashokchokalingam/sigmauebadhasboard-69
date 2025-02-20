
import { AlignLeft } from "lucide-react";
import { BaseIconCell } from "./BaseIconCell";

interface DescriptionCellProps {
  description: string;
}

export const DescriptionCell = ({ description }: DescriptionCellProps) => (
  <BaseIconCell icon={AlignLeft} text={description} />
);
