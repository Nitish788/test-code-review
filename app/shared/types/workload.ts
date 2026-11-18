export interface AssigneeWorkloadRow {
  assignee: string;
  taskCount: number;
  openCount: number;
  overdueCount: number;
  storyPoints: number | string;
  displayHtml: string;
}

export interface WorkloadSummary {
  rows: AssigneeWorkloadRow[];
  totalAssignees: number;
  totalOpenTasks: number;
  generatedAt: string;
}

export interface WorkloadOptions {
  /** ISO date string treated as "today" for overdue checks */
  nowIso?: string;
  includeUnassigned?: boolean;
}
