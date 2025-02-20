
import { Shield } from "lucide-react";
import { BaseIconCell } from "./BaseIconCell";

interface RuleCellProps {
  text: string;
  isBold?: boolean;
}

export const RuleCell = ({ text, isBold }: RuleCellProps) => (
  <BaseIconCell icon={Shield} text={text} isBold={isBold} />
);
