import { useState, useCallback, useEffect } from "react";
import { HistoryAction, HistoryState, DeleteAction } from "../types/history";
import { Task } from "../types/task";
import { tasksStorage } from "../utils/tasks-storage";
import { notifications } from "@mantine/notifications";

// Limit history to prevent memory issues in long sessions
const MAX_HISTORY_LENGTH = 50;

export function useHistory(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  // Track past actions for undo and future actions for redo
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    future: [],
  });

  const addToHistory = useCallback(
    (action: HistoryAction) => {
      // First, record the action in history
      // For DELETE actions, also store the task's index
      if (action.type === "DELETE") {
        const taskIndex = tasks.findIndex((task) => task.id === action.data.id);
        action = {
          ...action,
          index: taskIndex, // Store the index where the task was deleted from
        };
      }

      setHistory((curr) => ({
        past: [...curr.past.slice(-MAX_HISTORY_LENGTH), action],
        future: [],
      }));

      // Then apply the action to our task list
      switch (action.type) {
        case "CREATE":
          setTasks((prev) => [action.data, ...prev]);
          break;
        case "UPDATE":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.data.id ? action.data : task
            )
          );
          break;
        case "DELETE":
          setTasks((prev) => prev.filter((task) => task.id !== action.data.id));
          break;
      }
    },
    [tasks]
  ); // Add tasks as dependency since we use it in the callback

  const undo = useCallback(() => {
    const currentHistory = history;
    if (currentHistory.past.length === 0) return;

    const previous = currentHistory.past[currentHistory.past.length - 1];
    const newPast = currentHistory.past.slice(0, -1);

    switch (previous.type) {
      case "CREATE":
        setTasks((tasks) => tasks.filter((t) => t.id !== previous.data.id));
        break;
      case "UPDATE":
        if (!previous.previousData) break;
        const prevData = previous.previousData;
        setTasks((tasks) =>
          tasks.map((t) => (t.id === prevData.id ? prevData : t))
        );
        break;
      case "DELETE":
        if (!previous.previousData) break;
        const deletedTask = previous.previousData;
        setTasks((tasks) => {
          // Insert the task at its original index, or append if index is not available
          const index = (previous as DeleteAction).index ?? tasks.length;
          return [...tasks.slice(0, index), deletedTask, ...tasks.slice(index)];
        });
        break;
    }

    setHistory({
      past: newPast,
      future: [...currentHistory.future, previous],
    });

    notifications.show({
      title: "Action undone",
      message: "The last action has been reversed",
      color: "blue",
    });
  }, [history]);

  const redo = useCallback(() => {
    const currentHistory = history;
    if (currentHistory.future.length === 0) return;

    // Get the most recent undone action
    const next = currentHistory.future[currentHistory.future.length - 1];
    // Remove it from future actions
    const newFuture = currentHistory.future.slice(0, -1);

    // Reapply the action that was previously undone
    // This is similar to addToHistory but we're pulling from the future instead
    switch (next.type) {
      case "CREATE":
        setTasks((tasks) => [next.data, ...tasks]);
        break;
      case "UPDATE":
        setTasks((tasks) =>
          tasks.map((t) => (t.id === next.data.id ? next.data : t))
        );
        break;
      case "DELETE":
        setTasks((tasks) => tasks.filter((t) => t.id !== next.data.id));
        break;
    }

    // Move the action back to the past array
    setHistory({
      past: [...currentHistory.past, next],
      future: newFuture,
    });

    // Provide visual feedback to user
    notifications.show({
      title: "Action redone",
      message: "The last undone action has been reapplied",
      color: "blue",
    });
  }, [history]);

  // Keep localStorage in sync with our tasks state
  // This ensures task persistence across page reloads
  useEffect(() => {
    tasksStorage.setTasks(tasks);
  }, [tasks]);

  return {
    tasks,
    setTasks,
    addToHistory,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
