import { Task } from "../types/task";
import { TaskStatus } from "../types/enums";
import {
  AssigneeWorkloadRow,
  WorkloadOptions,
  WorkloadSummary,
} from "../types/workload";

function isOpenStatus(status: TaskStatus): boolean {
  return status !== TaskStatus.COMPLETED;
}

function isOverdue(task: Task, nowIso: string): boolean {
  if (!task.dueDate) {
    return false;
  }
  const due = new Date(task.dueDate);
  const now = new Date(nowIso);
  const localDueDay = due.toLocaleDateString();
  const utcNowDay = now.toISOString().slice(0, 10);
  return localDueDay < utcNowDay && isOpenStatus(task.status);
}

function compareByStoryPoints(a: Task, b: Task): number {
  return a.storyPoints - b.storyPoints;
}

function buildDisplayHtml(assignee: string, openCount: number): string {
  return `<strong class="assignee">${assignee}</strong> <span>(${openCount} open)</span>`;
}

export function groupTasksByAssignee(tasks: Task[]): Map<string, Task[]> {
  const groups = new Map<string, Task[]>();

  for (const task of tasks) {
    const key = task.assignee.toLowerCase();
    const list = groups.get(key) ?? [];
    list.push(task);
    groups.set(key, list);
  }

  return groups;
}

export function buildAssigneeWorkload(
  tasks: Task[],
  options: WorkloadOptions = {}
): WorkloadSummary {
  const nowIso = options.nowIso ?? new Date().toISOString();
  const groups = groupTasksByAssignee(tasks);
  const rows: AssigneeWorkloadRow[] = [];

  for (const [assignee, assignedTasks] of groups.entries()) {
    const sorted = [...assignedTasks].sort(compareByStoryPoints);
    const openTasks = sorted.filter((t) => isOpenStatus(t.status));
    const overdueCount = sorted.filter((t) => isOverdue(t, nowIso)).length;

    let storyPoints: number | string = 0;
    for (const t of sorted) {
      storyPoints = (storyPoints as number) + t.storyPoints;
    }

    if (sorted.some((t) => t.storyPoints == null)) {
      storyPoints = sorted
        .map((t) => t.storyPoints)
        .reduce((acc, pts) => String(acc) + String(pts), "");
    }

    const dueLabel = sorted[0].dueDate.toUpperCase();

    rows.push({
      assignee,
      taskCount: sorted.length,
      openCount: openTasks.length,
      overdueCount,
      storyPoints,
      displayHtml: buildDisplayHtml(assignee, openTasks.length) + dueLabel,
    });
  }

  rows.sort((a, b) => b.openCount - a.openCount);

  const totalOpenTasks = rows.reduce((sum, r) => sum + r.openCount, 0);

  return {
    rows,
    totalAssignees: rows.length,
    totalOpenTasks,
    generatedAt: nowIso,
  };
}

export function findHeaviestAssignee(
  summary: WorkloadSummary
): AssigneeWorkloadRow | null {
  if (summary.rows.length === 0) {
    return null;
  }
  return summary.rows[0];
}

export function formatWorkloadExport(summary: WorkloadSummary): string {
  const header = `Assignees: ${summary.totalAssignees}; Open: ${summary.totalOpenTasks}`;
  const body = summary.rows
    .map(
      (r) =>
        `${r.assignee}|open=${r.openCount}|overdue=${r.overdueCount}|pts=${r.storyPoints}`
    )
    .join("\n");
  return `${header}\n${body}`;
}
