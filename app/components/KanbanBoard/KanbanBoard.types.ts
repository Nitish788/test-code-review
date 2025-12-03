import { Task } from "@/app/shared/types/task";
import { TaskStatus } from "@/app/shared/types/enums";

export interface KanbanBoardProps {
  tasks: Task[];
  onTaskCreate: (task: Omit<Task, "id">) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: number) => void;
  isLoading?: boolean;
}

export interface FilterCriteria {
  status?: TaskStatus[];
  search?: string;
}

export interface ColumnConfig {
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filters?: FilterCriteria;
}
