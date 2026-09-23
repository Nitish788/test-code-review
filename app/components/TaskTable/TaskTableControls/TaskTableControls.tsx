"use client";

import { Group, MultiSelect, TextInput, Button } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useMemo } from "react";
import styles from "../TaskTable.module.css";

interface TaskTableControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedPriorities: string[];
  onPrioritiesChange: (values: string[]) => void;
  selectedStatuses: string[];
  onStatusesChange: (values: string[]) => void;
  searchAssignee: string;
  onSearchAssigneeChange: (value: string) => void;
}

export function TaskTableControls({
  searchQuery,
  onSearchChange,
  selectedPriorities,
  onPrioritiesChange,
  selectedStatuses,
  onStatusesChange,
  searchAssignee,
  onSearchAssigneeChange,
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

  const hasFilters = searchQuery || selectedPriorities.length > 0 || selectedStatuses.length > 0 || searchAssignee;

  const handleClearFilters = () => {
    onSearchChange("");
    onPrioritiesChange([]);
    onStatusesChange([]);
    onSearchAssigneeChange("");
  };

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
      <TextInput
        className={styles.filterSelect}
        placeholder="Filter by assignee"
        value={searchAssignee}
        onChange={(e) => onSearchAssigneeChange(e.target.value)}
        leftSection={<IconSearch size={16} />}
        aria-label="Filter tasks by assignee"
      />
      {hasFilters && (
        <Button 
          variant="subtle" 
          color="gray" 
          size="sm" 
          onClick={handleClearFilters}
          leftSection={<IconX size={14} />}
        >
          Clear
        </Button>
      )}
    </Group>
  );
}
