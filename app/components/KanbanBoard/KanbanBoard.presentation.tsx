"use client";

import { Task } from "@/app/shared/types/task";
import { TaskPriority } from "@/app/shared/types/enums";
import {
  Group,
  Stack,
  Text,
  Button,
  Select,
  Skeleton,
  TextInput,
  MultiSelect,
} from "@mantine/core";
import { IconPlus, IconTrash, IconSearch } from "@tabler/icons-react";
import { DragEvent } from "react";
import styles from "./KanbanBoard.module.css";
import type { ColumnConfig } from "./KanbanBoard.types";

interface KanbanBoardPresentationProps {
  priorityColumns: TaskPriority[];
  statusOptions: { value: string; label: string }[];
  columnConfigs: Record<TaskPriority, ColumnConfig>;
  isLoading: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>, task: Task) => void;
  onDrop: (
    e: DragEvent<HTMLDivElement>,
    priority: TaskPriority,
    index?: number
  ) => void;
  onColumnSort: (priority: TaskPriority, field: string | null) => void;
  onColumnFilter: (
    priority: TaskPriority,
    type: "status" | "search",
    value: string[] | string
  ) => void;
  onCreateTask: (priority: TaskPriority) => void;
  onDeleteTask: (taskId: number) => void;
  getFilteredAndSortedTasks: (priority: TaskPriority) => Task[];
  onDragEnd: () => void;
}

export function KanbanBoardPresentation({
  priorityColumns,
  statusOptions,
  columnConfigs,
  isLoading,
  onDragStart,
  onDrop,
  onColumnSort,
  onColumnFilter,
  onCreateTask,
  onDeleteTask,
  getFilteredAndSortedTasks,
  onDragEnd,
}: KanbanBoardPresentationProps) {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "var(--mantine-color-gray-1)";
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = "";
  };

  return (
    <Group
      className={styles.board}
      align="stretch"
      grow
      preventGrowOverflow={false}
      w="100%"
    >
      {isLoading
        ? priorityColumns.map((priority) => (
            <Skeleton
              key={priority}
              height={400}
              radius="md"
              className={styles.column}
            />
          ))
        : priorityColumns.map((priority) => (
            <Stack key={priority} className={styles.column} h="100%">
              <div className={styles.columnHeader}>
                <Text size="sm" fw={600}>
                  {priority}
                </Text>
                <div className={styles.columnFilters}>
                  <Select
                    size="xs"
                    className={styles.filterControl}
                    placeholder="Sort by..."
                    value={columnConfigs[priority].sortBy}
                    data={[
                      { value: "title", label: "Title" },
                      { value: "status", label: "Status" },
                    ]}
                    onChange={(value) => onColumnSort(priority, value)}
                  />
                  <MultiSelect
                    size="xs"
                    className={styles.filterControl}
                    placeholder="Filter status"
                    value={columnConfigs[priority].filters?.status ?? []}
                    data={statusOptions}
                    onChange={(value) =>
                      onColumnFilter(priority, "status", value)
                    }
                  />
                  <TextInput
                    size="xs"
                    className={styles.filterControl}
                    placeholder="Search..."
                    value={columnConfigs[priority].filters?.search ?? ""}
                    onChange={(e) =>
                      onColumnFilter(priority, "search", e.target.value)
                    }
                    leftSection={<IconSearch size={14} />}
                  />
                </div>
              </div>
              <div
                className={styles.columnContent}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.backgroundColor = "";
                  onDrop(e, priority);
                }}
                role="list"
                aria-label={`${priority} priority tasks`}
              >
                {getFilteredAndSortedTasks(priority).map((task, index) => (
                  <div
                    key={task.id}
                    className={styles.card}
                    draggable
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.style.transform = "translateY(2px)";
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.transform = "";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.style.transform = "";
                      onDrop(e, priority, index);
                    }}
                    role="listitem"
                    aria-label={`Task: ${task.title}, Status: ${task.status}`}
                  >
                    <Group justify="space-between" align="start">
                      <div>
                        <Text size="sm" fw={500}>
                          {task.title}
                        </Text>
                        <Text size="xs" c="dimmed" className={styles.status}>
                          {task.status.replace("_", " ")}
                        </Text>
                      </div>
                      <Button
                        variant="subtle"
                        color="red"
                        size="xs"
                        onClick={() => onDeleteTask(task.id)}
                      >
                        <IconTrash size={14} />
                      </Button>
                    </Group>
                  </div>
                ))}
              </div>
              <Button
                variant="light"
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={() => onCreateTask(priority)}
                className={styles.addButton}
              >
                Add Task
              </Button>
            </Stack>
          ))}
    </Group>
  );
}
