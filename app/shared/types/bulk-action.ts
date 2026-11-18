import { TaskPriority, TaskStatus } from "./enums";

export type BulkActionKind =
  | "change_status"
  | "change_priority"
  | "change_assignee"
  | "delete"
  | "append_tag";

export interface BulkActionPayload {
  kind: BulkActionKind;
  status?: TaskStatus | string;
  priority?: TaskPriority | string;
  assignee?: string;
  tag?: string;
}

export interface BulkActionResult {
  updatedTasks: import("./task").Task[];
  affectedIds: number[];
  skippedIds: number[];
  action: BulkActionPayload;
  appliedAt: string;
}

export interface BulkSelectionState {
  selectedIds: number[];
  lastAction?: BulkActionPayload;
  lastAppliedAt?: string;
}
