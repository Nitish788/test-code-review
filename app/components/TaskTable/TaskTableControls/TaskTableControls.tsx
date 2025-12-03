"use client";

import { Group, MultiSelect, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useMemo } from "react";
import styles from "../TaskTable.module.css";

interface TaskTableControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedPriorities: string[];
  onPrioritiesChange: (values: string[]) => void;
  selectedStatuses: string[];
  onStatusesChange: (values: string[]) => void;
}

export function TaskTableControls({
  searchQuery,
  onSearchChange,
  selectedPriorities,
  onPrioritiesChange,
  selectedStatuses,
  onStatusesChange,
}: TaskTableControlsProps) {
  const priorityOptions = useMemo(
    () => [
      { value: "high", label: "High" },
      { value: "urgent", label: "Urgent" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
      { value: "none", label: "None" },
    ],
    []
  );

  const statusOptions = useMemo(
    () => [
      { value: "not_started", label: "Not Started" },
      { value: "in_progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
    []
  );

  return (
    <Group
      className={styles.controls}
      role="search"
      aria-label="Task filter controls"
    >
      <TextInput
        className={styles.searchInput}
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        leftSection={<IconSearch size={16} />}
        aria-label="Search tasks"
      />
      <MultiSelect
        className={styles.filterSelect}
        data={priorityOptions}
        value={selectedPriorities}
        onChange={onPrioritiesChange}
        placeholder="Filter by priority"
        clearable
        aria-label="Filter tasks by priority"
      />
      <MultiSelect
        className={styles.filterSelect}
        data={statusOptions}
        value={selectedStatuses}
        onChange={onStatusesChange}
        placeholder="Filter by status"
        clearable
        aria-label="Filter tasks by status"
      />
    </Group>
  );
}
