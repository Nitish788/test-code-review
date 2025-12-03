"use client";

import dynamic from "next/dynamic";
import { Task } from "@/app/shared/types/task";
import { TaskPriority, TaskStatus } from "@/app/shared/types/enums";
import { DragEvent, useState, useEffect } from "react";
import type { KanbanBoardProps, ColumnConfig } from "./KanbanBoard.types";
import { KanbanBoardPresentation } from "./KanbanBoard.presentation";
import { useDisclosure } from "@mantine/hooks";

// These are the options users can select from when filtering tasks by status
// I'm using human-readable labels for the UI while keeping enum values for the backend
const STATUS_OPTIONS = [
  { value: TaskStatus.NOT_STARTED, label: "Not Started" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.COMPLETED, label: "Completed" },
];

const TaskForm = dynamic(
  () => import("../TaskForm/TaskForm").then((mod) => mod.TaskForm),
  {
    ssr: false,
  }
);

export function KanbanBoardContainer({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  isLoading = false,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [columnOrder, setColumnOrder] = useState<
    Record<TaskPriority, number[]>
  >(() => {
    const order: Record<TaskPriority, number[]> = {
      [TaskPriority.URGENT]: [],
      [TaskPriority.HIGH]: [],
      [TaskPriority.MEDIUM]: [],
      [TaskPriority.LOW]: [],
      [TaskPriority.NONE]: [],
    };

    // Initialize with current task IDs
    tasks.forEach((task) => {
      order[task.priority].push(task.id);
    });

    return order;
  });

  // When tasks change (create/update/delete), sync the column order
  useEffect(() => {
    setColumnOrder((prev) => {
      const newOrder = { ...prev };
      Object.values(TaskPriority).forEach((priority) => {
        const existingIds = new Set(newOrder[priority]);
        const currentTasks = tasks
          .filter((task) => task.priority === priority)
          .map((task) => task.id);

        newOrder[priority] = [
          // Keep existing tasks that are still present
          ...newOrder[priority].filter((id) =>
            tasks.some((task) => task.id === id)
          ),
          // Add any new tasks that weren't in the order before
          ...currentTasks.filter((id) => !existingIds.has(id)),
        ];
      });
      return newOrder;
    });
  }, [tasks]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        id: task.id,
        priority: task.priority,
      })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    priority: TaskPriority,
    index?: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Drop event:", { draggedTask, priority, index });

    if (!draggedTask) {
      console.warn("No dragged task found");
      return;
    }

    // First update the task in parent component
    const updatedTask = { ...draggedTask, priority };
    onTaskUpdate(updatedTask);

    // Then update the column order
    setColumnOrder((prev) => {
      const sourceColumn = [...prev[draggedTask.priority]];
      const targetColumn = [...prev[priority]];

      // Remove from source
      const taskIndex = sourceColumn.indexOf(draggedTask.id);
      if (taskIndex > -1) {
        sourceColumn.splice(taskIndex, 1);
      }

      // Add to target
      if (typeof index === "number") {
        targetColumn.splice(index, 0, draggedTask.id);
      } else {
        targetColumn.push(draggedTask.id);
      }

      return {
        ...prev,
        [draggedTask.priority]: sourceColumn,
        [priority]: targetColumn,
      };
    });

    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const [columnConfigs, setColumnConfigs] = useState<
    Record<TaskPriority, ColumnConfig>
  >(() => {
    const configs: Record<TaskPriority, ColumnConfig> = {} as Record<
      TaskPriority,
      ColumnConfig
    >;
    Object.values(TaskPriority).forEach((priority) => {
      configs[priority] = {
        sortBy: undefined,
        filters: {
          status: [],
          search: "",
        },
      };
    });
    return configs;
  });

  // I'm implementing a toggle sort - clicking the same field twice reverses the direction
  const handleColumnSort = (priority: TaskPriority, field: string | null) => {
    if (!field) return;

    setColumnConfigs((prev) => {
      const currentConfig = prev[priority];
      const newDirection =
        currentConfig.sortBy === field && currentConfig.sortDirection === "asc"
          ? "desc"
          : "asc";

      return {
        ...prev,
        [priority]: {
          ...currentConfig,
          sortBy: field,
          sortDirection: newDirection,
        },
      };
    });
  };

  // Users can filter tasks in each column independently
  // I support both status-based filtering and text search
  const handleColumnFilter = (
    priority: TaskPriority,
    type: "status" | "search",
    value: string[] | string
  ) => {
    setColumnConfigs((prev) => ({
      ...prev,
      [priority]: {
        ...prev[priority],
        filters: {
          ...prev[priority].filters,
          [type]: value,
        },
      },
    }));
  };

  // This is where I combine sorting, filtering, and manual ordering
  // The order of operations is important: filter first, then sort
  const getFilteredAndSortedTasks = (priority: TaskPriority) => {
    const config = columnConfigs[priority];
    const columnTasks = tasks.filter((task) => task.priority === priority);

    // First, I apply any active filters
    let filtered = columnTasks;
    if (config.filters?.status?.length) {
      filtered = filtered.filter((task) =>
        config.filters?.status?.includes(task.status)
      );
    }
    if (config.filters?.search) {
      // Case-insensitive search in task titles
      filtered = filtered.filter((task) =>
        task.title
          .toLowerCase()
          .includes(config.filters?.search?.toLowerCase() ?? "")
      );
    }

    // Then I either apply the selected sort or use the manual drag-and-drop order
    if (config.sortBy) {
      filtered.sort((a, b) => {
        const aValue = String(a[config.sortBy as keyof Task]);
        const bValue = String(b[config.sortBy as keyof Task]);
        return config.sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    } else {
      // If no sort is selected, I respect the manual ordering from drag-and-drop
      filtered.sort((a, b) => {
        const aIndex = columnOrder[priority].indexOf(a.id);
        const bIndex = columnOrder[priority].indexOf(b.id);
        return aIndex - bIndex;
      });
    }

    return filtered;
  };

  // Add new state for task form
  const [opened, { open, close }] = useDisclosure(false);
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority | null>(
    null
  );

  // Update the create task handler
  const handleCreateTask = (priority: TaskPriority) => {
    setNewTaskPriority(priority);
    open();
  };

  // Add handler for form submission
  const handleSubmitTask = (task: Omit<Task, "id">) => {
    onTaskCreate(task);
    close();
    setNewTaskPriority(null);
  };

  return (
    <>
      <KanbanBoardPresentation
        priorityColumns={Object.values(TaskPriority)}
        statusOptions={STATUS_OPTIONS}
        columnConfigs={columnConfigs}
        isLoading={isLoading}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onColumnSort={handleColumnSort}
        onColumnFilter={handleColumnFilter}
        onCreateTask={handleCreateTask}
        onDeleteTask={onTaskDelete}
        getFilteredAndSortedTasks={getFilteredAndSortedTasks}
      />

      <TaskForm
        opened={opened}
        onClose={() => {
          close();
          setNewTaskPriority(null);
        }}
        onSubmit={handleSubmitTask}
        initialValues={
          newTaskPriority
            ? {
                title: "",
                priority: newTaskPriority,
                status: TaskStatus.NOT_STARTED,
                customFields: {},
              }
            : undefined
        }
        title="Create Task"
      />
    </>
  );
}
