"use client";
import { useState, useMemo, useEffect } from "react";
import { Task } from "@/app/shared/types/task";
import { Box, Button, Group, Text, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { tasksStorage } from "@/app/shared/utils/tasks-storage";
import type { CustomField } from "@/app/shared/types/custom-field";

import { TaskTablePresentation } from "./TaskTable.presentation";
import { CustomFieldsManager } from "../CustomFields";
import styles from "./TaskTable.module.css";
import { TaskForm } from "../TaskForm/TaskForm";
import { TaskTableControls } from "./TaskTableControls/TaskTableControls";
import { TaskTablePagination } from "./TaskTablePagination/TaskTablePagination";
import { ConfirmationModal } from "../Common/ConfirmationModal/ConfirmationModal";
import { TaskTableContainerProps } from "./TaskTable.types";
import { PRIORITY_ORDER, STATUS_ORDER } from "./TaskTable.utils";
import { useHistory } from "@/app/shared/hooks/useHistory";
import { TaskTableHistory } from "./TaskTableHistory/TaskTableHistory";
import { useHotkeys } from "@mantine/hooks";
import { ViewToggle } from "../ViewToggle/ViewToggle";
import { ViewMode } from "@/app/shared/types/enums";
import { KanbanBoard } from "../KanbanBoard";
import { customFieldsStorage } from "@/app/shared/utils/custom-fields-storage";
import { filterStorage } from "@/app/shared/utils/filter-storage";
import { taskStats as TaskStats } from "../TaskStats/taskStats";

export function TaskTableContainer({
  tasks: initialTasks,
}: TaskTableContainerProps) {
  const { tasks, setTasks, addToHistory, undo, redo, canUndo, canRedo } =
    useHistory(initialTasks);

  const [customFields, setCustomFields] = useState<CustomField[]>(() => {
    return customFieldsStorage.getCustomFields();
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    const savedState = filterStorage.getFilterState();
    return savedState.searchQuery || "";
  });
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(() => {
    const savedState = filterStorage.getFilterState();
    return savedState.selectedPriorities || [];
  });
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    const savedState = filterStorage.getFilterState();
    return savedState.selectedStatuses || [];
  });
  const [sortColumn, setSortColumn] = useState<string | undefined>(() => {
    const savedState = filterStorage.getFilterState();
    return savedState.sortColumn;
  });
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(() => {
    const savedState = filterStorage.getFilterState();
    return savedState.sortDirection || "asc";
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const savedState = filterStorage.getFilterState();
    return savedState.currentPage || 1;
  });
  const [pageSize, setPageSize] = useState(() => {
    const savedState = filterStorage.getFilterState();
    return savedState.pageSize || 10;
  });
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  const [
    customFieldsModalOpened,
    { open: openCustomFieldsModal, close: closeCustomFieldsModal },
  ] = useDisclosure(false);

  const [view, setView] = useState<"table" | "kanban">("table");

  useHotkeys([
    ["mod+z", () => canUndo && undo()],
    ["mod+y", () => canRedo && redo()],
  ]);

  const filteredTasks = useMemo(() => {
    if (view !== "table") return tasks;

    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPriority =
        selectedPriorities.length === 0 ||
        selectedPriorities.includes(task.priority);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(task.status);

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, selectedPriorities, selectedStatuses, view]);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTasks.slice(startIndex, endIndex);
  }, [filteredTasks, currentPage, pageSize]);

  const handleSort = (column: string) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(column);

    const customField = customFields.find((field) => field.id === column);
    const fieldName = customField?.name || column;

    const sortedTasks = [...tasks].sort((a, b) => {
      let aValue: string | number = String(a[column as keyof Task] || "");
      let bValue: string | number = String(b[column as keyof Task] || "");

      if (customField && a.customFields && b.customFields) {
        const aCustom = a.customFields[fieldName];
        const bCustom = b.customFields[fieldName];

        if (customField.type === "number") {
          if (aCustom === undefined && bCustom === undefined) return 0;
          if (aCustom === undefined) return isAsc ? 1 : -1;
          if (bCustom === undefined) return isAsc ? -1 : 1;

          return isAsc
            ? Number(aCustom || 0) - Number(bCustom || 0)
            : Number(bCustom || 0) - Number(aCustom || 0);
        }

        if (customField.type === "checkbox") {
          const aCheck = Boolean(aCustom);
          const bCheck = Boolean(bCustom);
          return isAsc
            ? Number(aCheck) - Number(bCheck)
            : Number(bCheck) - Number(aCheck);
        }

        if (aCustom === undefined && bCustom === undefined) return 0;
        if (aCustom === undefined) return isAsc ? 1 : -1;
        if (bCustom === undefined) return isAsc ? -1 : 1;

        aValue = String(aCustom);
        bValue = String(bCustom);
      }

      if (column === "priority") {
        const priorityA = PRIORITY_ORDER[aValue as keyof typeof PRIORITY_ORDER];
        const priorityB = PRIORITY_ORDER[bValue as keyof typeof PRIORITY_ORDER];
        return isAsc ? priorityA - priorityB : priorityB - priorityA;
      }

      if (column === "status") {
        const statusA = STATUS_ORDER[aValue as keyof typeof STATUS_ORDER];
        const statusB = STATUS_ORDER[bValue as keyof typeof STATUS_ORDER];
        return isAsc ? statusA - statusB : statusB - statusA;
      }

      aValue = String(aValue || "");
      bValue = String(bValue || "");
      return isAsc
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    setTasks(sortedTasks);
  };

  const handleCreateTask = (newTask: Omit<Task, "id">) => {
    const taskWithId: Task = {
      ...newTask,
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
    };
    addToHistory({
      type: "CREATE",
      data: taskWithId,
    });
    close();
    notifications.show({
      title: "Task Created",
      message: `Task "${taskWithId.title}" has been created successfully`,
      color: "green",
      icon: <IconCheck size={16} />,
    });
  };

  const handleEditTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      open();
    }
  };

  const handleUpdateTask = (taskData: Omit<Task, "id"> | Task) => {
    const task =
      "id" in taskData ? taskData : { ...taskData, id: editingTask!.id };
    console.log("Updating task:", task);
    const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(updatedTasks);
    addToHistory({
      type: "UPDATE",
      data: task,
      previousData: tasks.find((t) => t.id === task.id)!,
    });
    close();

    notifications.show({
      title: "Task Updated",
      message: "Task has been successfully updated",
      color: "green",
      icon: <IconCheck />,
    });
  };

  const handleDeleteTask = (taskId: number) => {
    setDeletingTaskId(taskId);
    openDeleteModal();
  };

  const handleConfirmDelete = () => {
    if (deletingTaskId) {
      const taskToDelete = tasks.find((task) => task.id === deletingTaskId);
      if (!taskToDelete) return;

      addToHistory({
        type: "DELETE",
        data: { id: deletingTaskId },
        previousData: taskToDelete,
      });

      setDeletingTaskId(null);
      closeDeleteModal();

      notifications.show({
        title: "Task Deleted",
        message: `Task "${taskToDelete.title}" has been deleted`,
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: string | null) => {
    if (!value) return;
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleAddCustomField = (field: Omit<CustomField, "id">) => {
    const newField: CustomField = {
      ...field,
      id: crypto.randomUUID(),
    };

    const updatedTasks = tasks.map((task) => {
      const defaultValue = () => {
        switch (field.type) {
          case "number":
            return 0;
          case "checkbox":
            return false;
          case "text":
          default:
            return "";
        }
      };

      return {
        ...task,
        customFields: {
          ...task.customFields,
          [newField.name]: defaultValue(),
        },
      };
    });

    setTasks(updatedTasks);
    tasksStorage.setTasks(updatedTasks);
    setCustomFields((prev) => [...prev, newField]);

    closeCustomFieldsModal();

    notifications.show({
      title: "Custom Field Added",
      message: `Custom field "${newField.name}" has been added successfully`,
      color: "green",
      icon: <IconCheck size={16} />,
    });
  };

  const handleRemoveCustomField = (fieldId: string) => {
    const fieldToRemove = customFields.find((field) => field.id === fieldId);
    setCustomFields((prev) => prev.filter((field) => field.id !== fieldId));

    const updatedTasks = tasks.map((task) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fieldToRemove?.name || ""]: _, ...remainingCustomFields } =
        task.customFields || {};
      return { ...task, customFields: remainingCustomFields };
    });

    setTasks(updatedTasks);
    tasksStorage.setTasks(updatedTasks);

    notifications.show({
      title: "Custom Field Removed",
      message: `Custom field "${fieldToRemove?.name}" has been removed`,
      color: "red",
      icon: <IconX size={16} />,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePrioritiesChange = (values: string[]) => {
    setSelectedPriorities(values);
    setCurrentPage(1);
  };

  const handleStatusesChange = (values: string[]) => {
    setSelectedStatuses(values);
    setCurrentPage(1);
  };

  useEffect(() => {
    customFieldsStorage.setCustomFields(customFields);
  }, [customFields]);

  useEffect(() => {
    if (view === "table") {
      filterStorage.setFilterState({
        searchQuery,
        selectedPriorities,
        selectedStatuses,
        sortColumn,
        sortDirection,
        currentPage,
        pageSize,
      });
    }
  }, [
    searchQuery,
    selectedPriorities,
    selectedStatuses,
    sortColumn,
    sortDirection,
    currentPage,
    pageSize,
    view,
  ]);

  if (!tasks.length) {
    return (
      <Box className={styles.emptyState}>
        <Text size="sm" c="dimmed">
          No tasks found
        </Text>
      </Box>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Group>
          <Button onClick={open} aria-label="Create new task">
            Create Task
          </Button>
          <Button
            variant="outline"
            onClick={openCustomFieldsModal}
            aria-label="Open custom fields manager"
          >
            Manage Custom Fields
          </Button>
        </Group>
        <ViewToggle
          view={view as ViewMode}
          onChange={setView}
          aria-label="Toggle view mode"
        />
      </Group>

      <TaskStats tasks={tasks} onRefresh={() => console.log("refreshing stats...")} />

      <TaskTableHistory
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />

      {view === "table" ? (
        <>
          <TaskTableControls
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedPriorities={selectedPriorities}
            onPrioritiesChange={handlePrioritiesChange}
            selectedStatuses={selectedStatuses}
            onStatusesChange={handleStatusesChange}
          />
          <TaskTablePresentation
            tasks={paginatedTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            customFields={customFields}
          />
          <TaskTablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredTasks.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      ) : (
        <Box w="100%" mih={600}>
          <KanbanBoard
            tasks={filteredTasks}
            onTaskCreate={handleCreateTask}
            onTaskUpdate={handleUpdateTask}
            onTaskDelete={(taskId) => {
              setDeletingTaskId(taskId);
              openDeleteModal();
            }}
            isLoading={false}
          />
        </Box>
      )}

      <TaskForm
        opened={opened}
        onClose={() => {
          close();
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialValues={editingTask ?? undefined}
        title={editingTask ? "Edit Task" : "Create Task"}
        customFields={customFields}
      />

      <ConfirmationModal
        opened={deleteModalOpened}
        onClose={() => {
          closeDeleteModal();
          setDeletingTaskId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />

      <CustomFieldsManager
        opened={customFieldsModalOpened}
        onClose={closeCustomFieldsModal}
        customFields={customFields}
        onAddField={handleAddCustomField}
        onRemoveField={handleRemoveCustomField}
      />
    </Stack>
  );
}
