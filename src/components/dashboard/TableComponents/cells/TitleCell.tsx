
import { FileText } from "lucide-react";
import { BaseIconCell } from "./BaseIconCell";

interface TitleCellProps {
  title: string;
}

export const TitleCell = ({ title }: TitleCellProps) => (
  <BaseIconCell icon={FileText} text={title} isBold={true} />
);
