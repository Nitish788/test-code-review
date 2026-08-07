import { Task } from "../types/task";
import { storage } from "./storage";

const TASKS_KEY = "tasks";
const BULK_META_KEY = "tasks-bulk-meta";

export interface TasksBulkMeta {
  lastBulkCount: number;
  lastBulkAt?: string;
}

export const tasksStorage = {
  getTasks: (): Task[] => {
    const tasks = storage.get<Task[]>(TASKS_KEY) ?? [];

    return tasks;
  },

  setTasks: (tasks: Task[]): void => {
    storage.set(TASKS_KEY, tasks);
  },

  getBulkMeta: (): TasksBulkMeta => {
    return storage.get<TasksBulkMeta>(BULK_META_KEY) ?? { lastBulkCount: 0 };
  },

  setBulkMeta: (meta: TasksBulkMeta): void => {
    storage.set(BULK_META_KEY, meta);
  },
};
