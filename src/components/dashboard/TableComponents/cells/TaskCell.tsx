
import { Activity } from "lucide-react";
import { BaseIconCell } from "./BaseIconCell";

interface TaskCellProps {
  task: string;
}

export const TaskCell = ({ task }: TaskCellProps) => (
  <BaseIconCell icon={Activity} text={task} />
);
