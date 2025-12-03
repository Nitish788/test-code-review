"use client";

import { useMemo } from "react";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import type { Task } from "@/app/shared/types/task";
import type { CustomField } from "@/app/shared/types/custom-field";

import { Table } from "../Common/Table/Table";
import styles from "./TaskTable.module.css";
import { SortDirection } from "@/app/shared/types/enums";

interface TaskTablePresentationProps {
  tasks: Task[];
  onEdit: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
  customFields: CustomField[];
}

export function TaskTablePresentation({
  tasks,
  onEdit,
  onDelete,
  sortColumn,
  sortDirection,
  onSort,
  customFields,
}: TaskTablePresentationProps) {
  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "Title",
        render: (task: Task) => task.title,
        sortable: true,
      },
      {
        key: "priority",
        header: "Priority",
        render: (task: Task) => (
          <span className={styles[`priority-${task.priority}`]}>
            {task.priority}
          </span>
        ),
        sortable: true,
      },
      {
        key: "status",
        header: "Status",
        render: (task: Task) => (
          <span className={styles[`status-${task.status}`]}>{task.status}</span>
        ),
        sortable: true,
      },
      ...customFields.map((field) => ({
        key: field.id,
        header: field.name,
        render: (task: Task) =>
          field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={!!task.customFields?.[field.name]}
              disabled
            />
          ) : (
            task.customFields?.[field.name] || "-"
          ),
        sortable: true,
      })),
      {
        key: "actions",
        header: "Actions",
        render: (task: Task) => (
          <Group gap="xs">
            <Tooltip label="Edit task" position="top">
              <ActionIcon
                variant="subtle"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task.id);
                }}
                aria-label={`Edit task: ${task.title}`}
              >
                <IconEdit size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete task" position="top">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                aria-label={`Delete task: ${task.title}`}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    [customFields, onEdit, onDelete]
  );

  return (
    <Table
      data={tasks}
      columns={columns}
      sortColumn={sortColumn}
      sortDirection={sortDirection as SortDirection}
      onSort={onSort}
      aria-label="Task list table"
      aria-rowcount={tasks.length}
    />
  );
}
