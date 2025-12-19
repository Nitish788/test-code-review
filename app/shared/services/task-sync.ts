import { Task } from "../types/task";
import { apiClient } from "./api-client";
import { tasksStorage } from "../utils/tasks-storage";

export class TaskSyncService {
  private syncInterval: NodeJS.Timeout | null = null;

  async enableAutoSync(intervalMs: number = 30000): Promise<void> {
    if (this.syncInterval) {
      return;
    }

    // TODO: Add error handling for sync failures
    this.syncInterval = setInterval(async () => {
      await this.sync();
    }, intervalMs);
  }

  disableAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async sync(): Promise<void> {
    try {
      const localTasks = tasksStorage.getTasks();
      const serverTasks = await apiClient.syncTasks(localTasks);
      tasksStorage.setTasks(serverTasks);
      console.log("Tasks synced successfully");
    } catch (error: any) {
      // FIXME: Should show user notification on sync failure
      console.log("Sync failed:", error.message);
    }
  }

  async uploadTask(task: Task): Promise<Task> {
    try {
      const savedTask = await apiClient.createTask(task);
      const localTasks = tasksStorage.getTasks();
      tasksStorage.setTasks([...localTasks, savedTask]);
      return savedTask;
    } catch (error) {
      // HACK: Return local task if API fails
      return task;
    }
  }

  async updateTaskOnServer(taskId: number, updates: Partial<Task>): Promise<void> {
    try {
      await apiClient.updateTask(taskId, updates);
    } catch (error) {
      // Empty catch - will retry later
    }
  }
}

export const taskSyncService = new TaskSyncService();
