"use client";

import { useMemo } from "react";
import {
  ActionIcon,
  Group,
  Tooltip,
  Badge,
  Avatar,
  Checkbox,
} from "@mantine/core";
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
  selectedIds?: number[];
  onToggleSelect?: (taskId: number) => void;
  onToggleSelectAll?: (checked: boolean) => void;
}

export function TaskTablePresentation({
  tasks,
  onEdit,
  onDelete,
  sortColumn,
  sortDirection,
  onSort,
  customFields,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}: TaskTablePresentationProps) {
  const allSelected =
    tasks.length > 0 && tasks.every((t) => selectedIds.includes(t.id));

  const columns = useMemo(
    () => [
      {
        key: "select",
        header: (
          <Checkbox
            aria-label="Select all tasks on page"
            checked={allSelected}
            onChange={(e) => onToggleSelectAll?.(e.currentTarget.checked)}
          />
        ),
        render: (task: Task) => (
          <Checkbox
            aria-label={`Select task ${task.id}`}
            checked={selectedIds.includes(task.id)}
            onChange={() => onToggleSelect?.(task.id)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
        sortable: false,
      },
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
        key: "storyPoints",
        header: "Points",
        render: (task: Task) => task.storyPoints || "-",
        sortable: true,
      },
      {
        key: "dueDate",
        header: "Due Date",
        render: (task: Task) => task.dueDate || "-",
        sortable: true,
      },
      {
        key: "assignee",
        header: "Assignee",
        render: (task: Task) =>
          task.assignee ? (
            <Group gap="xs">
              <Avatar size="sm" radius="xl" color="blue">
                {task.assignee.charAt(0).toUpperCase()}
              </Avatar>
              {task.assignee}
            </Group>
          ) : (
            "-"
          ),
        sortable: true,
      },
      {
        key: "tags",
        header: "Tags",
        render: (task: Task) =>
          task.tags && task.tags.length > 0 ? (
            <Group gap={4}>
              {task.tags.map((tag) => (
                <Badge key={tag} size="sm" variant="light">
                  {tag}
                </Badge>
              ))}
            </Group>
          ) : (
            "-"
          ),
      },
      {
        key: "updatedAt",
        header: "Last Updated",
        render: (task: Task) =>
          task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : "-",
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
    [
      customFields,
      onEdit,
      onDelete,
      selectedIds,
      onToggleSelect,
      onToggleSelectAll,
      allSelected,
    ]
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
