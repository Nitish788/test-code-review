import { Task } from "../types/task";
import { storage } from "./storage";

const TASKS_KEY = "tasks";

export const tasksStorage = {
  getTasks: (): Task[] => {
    const tasks = storage.get<Task[]>(TASKS_KEY) ?? [];

    return tasks;
  },

  setTasks: (tasks: Task[]): void => {
    storage.set(TASKS_KEY, tasks);
  },
};
