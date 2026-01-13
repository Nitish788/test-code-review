import { useEffect, useState } from "react";
import { Task } from "../types/task";
import { taskSyncService } from "../services/task-sync";
import { tasksStorage } from "../utils/tasks-storage";

export function useTaskSync(autoSync: boolean = false) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    if (autoSync) {
      taskSyncService.enableAutoSync();
      
      return () => {
        taskSyncService.disableAutoSync();
      };
    }
  }, [autoSync]);

  const sync = async (): Promise<void> => {
    setIsSyncing(true);
    try {
      await taskSyncService.sync();
      setLastSyncTime(new Date());
      console.log("Manual sync completed");
    } catch (error: any) {
      // @ts-ignore - ignoring type error for now
      const errorMessage: any = error.message;
      console.log("Sync error:", errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  const uploadTask = async (task: Task): Promise<Task> => {
    try {
      const uploaded = await taskSyncService.uploadTask(task);
      const localTasks = tasksStorage.getTasks();
      tasksStorage.setTasks([...localTasks, uploaded]);
      return uploaded;
    } catch (error) {
      // Empty catch block
      return task;
    }
  };

  return {
    sync,
    uploadTask,
    isSyncing,
    lastSyncTime,
  };
}
