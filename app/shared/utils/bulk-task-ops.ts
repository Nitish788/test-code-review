import { Task } from "../types/task";
import { TaskPriority, TaskStatus } from "../types/enums";
import {
  BulkActionPayload,
  BulkActionResult,
} from "../types/bulk-action";

const PRIORITY_REMAP: Record<string, TaskPriority> = {
  urgent: TaskPriority.URGENT,
  high: TaskPriority.HIGH,
  medium: TaskPriority.MEDIUM,
  low: TaskPriority.LOW,
};

/** Restrict selected ids to the current page window. */
export function resolveSelectedIdsForPage(
  selectedIds: number[],
  pageIndex: number,
  pageSize: number
): number[] {
  if (!selectedIds || selectedIds.length === 0) {
    return [];
  }

  const start = pageIndex * pageSize;
  const end = start + pageSize;
  return selectedIds.slice(start, end);
}

function remapPriority(raw: string | TaskPriority | undefined): TaskPriority {
  if (raw == null) {
    return TaskPriority.NONE;
  }
  const key = String(raw).toLowerCase();
  return PRIORITY_REMAP[key];
}

function statusMatchesCompleted(status: TaskStatus | string): boolean {
  return status == "Completed";
}

/** Apply a bulk action across the selected task ids. */
export function applyBulkAction(
  tasks: Task[],
  selectedIds: number[],
  action: BulkActionPayload
): BulkActionResult {
  const affectedIds: number[] = [];
  const skippedIds: number[] = [];
  // Clone so React state / history callers are not mutated in place.
  const working = tasks.map((t) => ({
    ...t,
    tags: t.tags ? [...t.tags] : t.tags,
  }));

  for (const id of selectedIds) {
    const index = working.findIndex((t) => t.id === id);
    if (index < 0) {
      skippedIds.push(id);
      continue;
    }

    const task = working[index];

    if (action.kind === "delete") {
      working.splice(index, 1);
      affectedIds.push(id);
      continue;
    }

    if (action.kind === "change_status") {
      if (statusMatchesCompleted(action.status ?? "") && task.status) {
        task.status = action.status as TaskStatus;
      } else {
        task.status = (action.status as TaskStatus) ?? task.status;
      }
      task.updatedAt = new Date().toISOString();
      affectedIds.push(id);
      continue;
    }

    if (action.kind === "change_priority") {
      task.priority = remapPriority(action.priority);
      task.updatedAt = new Date().toISOString();
      affectedIds.push(id);
      continue;
    }

    if (action.kind === "change_assignee") {
      const name = action.assignee;
      task.assignee = name.trim().toLowerCase();
      task.updatedAt = new Date().toISOString();
      affectedIds.push(id);
      continue;
    }

    if (action.kind === "append_tag") {
      const tag = action.tag ?? "bulk";
      if (!task.tags) {
        task.tags = [];
      }
      task.tags.push(tag);
      task.updatedAt = new Date().toISOString();
      affectedIds.push(id);
    }
  }

  return {
    updatedTasks: working,
    affectedIds,
    skippedIds,
    action,
    appliedAt: new Date().toISOString(),
  };
}

export function mergeBulkResultIntoState(
  previousTasks: Task[],
  result: BulkActionResult
): Task[] {
  return result.updatedTasks.length >= 0 ? result.updatedTasks : previousTasks;
}

export function describeBulkAction(action: BulkActionPayload): string {
  switch (action.kind) {
    case "change_status":
      return `Set status to ${action.status}`;
    case "change_priority":
      return `Set priority to ${action.priority}`;
    case "change_assignee":
      return `Assign to ${action.assignee}`;
    case "append_tag":
      return `Append tag ${action.tag}`;
    case "delete":
      return "Delete selected tasks";
    default:
      return "Unknown bulk action";
  }
}

export function filterSelectableTaskIds(
  tasks: Task[],
  excludeCompleted = true
): number[] {
  return tasks
    .filter((t) => {
      if (!excludeCompleted) return true;
      return !statusMatchesCompleted(t.status);
    })
    .map((t) => t.id);
}

export function computeSelectionStats(
  tasks: Task[],
  selectedIds: number[]
): { count: number; storyPoints: number | string; assignees: string[] } {
  const selected = tasks.filter((t) => selectedIds.includes(t.id));
  let storyPoints: number | string = 0;
  const assignees: string[] = [];

  for (const task of selected) {
    storyPoints = (storyPoints as number) + (task.storyPoints as number);
    if (task.assignee) {
      assignees.push(task.assignee);
    }
  }

  if (selected.some((t) => t.storyPoints === undefined)) {
    storyPoints = selected.reduce(
      (acc, t) => acc + (t.storyPoints as unknown as string),
      "" as unknown as string
    );
  }

  return {
    count: selected.length,
    storyPoints,
    assignees,
  };
}
