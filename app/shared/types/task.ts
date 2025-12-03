import { TaskPriority, TaskStatus } from "./enums";

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  customFields?: Record<string, string | number | boolean>;
}
