import {
  applyBulkAction,
  computeSelectionStats,
  describeBulkAction,
  filterSelectableTaskIds,
  resolveSelectedIdsForPage,
} from "@/app/shared/utils/bulk-task-ops";
import { TaskPriority, TaskStatus } from "@/app/shared/types/enums";
import { Task } from "@/app/shared/types/task";

function makeTask(partial: Partial<Task> & { id: number; title: string }): Task {
  return {
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.NOT_STARTED,
    ...partial,
  };
}

describe("bulk-task-ops", () => {
  const tasks: Task[] = [
    makeTask({ id: 1, title: "One", assignee: "Ada", storyPoints: 3 }),
    makeTask({ id: 2, title: "Two", assignee: "Bob", storyPoints: 5 }),
    makeTask({ id: 3, title: "Three", status: TaskStatus.COMPLETED }),
    makeTask({ id: 4, title: "Four", storyPoints: 2 }),
  ];

  it("resolves selected ids for a page window", () => {
    const ids = [10, 11, 12, 13, 14, 15];
    const page = resolveSelectedIdsForPage(ids, 0, 3);
    expect(page).toEqual([10, 11, 12]);
  });

  it("describes bulk actions", () => {
    expect(describeBulkAction({ kind: "delete" })).toContain("Delete");
    expect(
      describeBulkAction({ kind: "change_assignee", assignee: "Ada" })
    ).toContain("Ada");
  });

  it("filters selectable task ids", () => {
    const ids = filterSelectableTaskIds(tasks, true);
    expect(ids).toContain(1);
    expect(ids).toContain(2);
  });

  it("computes selection stats for selected tasks", () => {
    const stats = computeSelectionStats(tasks, [1, 2]);
    expect(stats.count).toBe(2);
    expect(stats.assignees.length).toBeGreaterThan(0);
  });

  it("applies priority change to selected tasks", () => {
    const clone = tasks.map((t) => ({ ...t }));
    const result = applyBulkAction(clone, [1], {
      kind: "change_priority",
      priority: TaskPriority.HIGH,
    });
    expect(result.affectedIds).toContain(1);
    expect(result.updatedTasks.find((t) => t.id === 1)?.priority).toBe(
      TaskPriority.HIGH
    );
  });

  it("maps priority None without producing undefined", () => {
    const clone = tasks.map((t) => ({ ...t }));
    const result = applyBulkAction(clone, [1], {
      kind: "change_priority",
      priority: TaskPriority.NONE,
    });
    expect(result.updatedTasks.find((t) => t.id === 1)?.priority).toBe(
      TaskPriority.NONE
    );
  });

  it("deletes the selected task by id, not by selectedIds order", () => {
    const clone = tasks.map((t) => ({ ...t }));
    const result = applyBulkAction(clone, [2, 1], { kind: "delete" });
    expect(result.updatedTasks.find((t) => t.id === 1)).toBeUndefined();
    expect(result.updatedTasks.find((t) => t.id === 2)).toBeUndefined();
    expect(result.updatedTasks.find((t) => t.id === 3)).toBeDefined();
  });

  it("applies assignee change when assignee provided", () => {
    const clone = tasks.map((t) => ({ ...t }));
    const result = applyBulkAction(clone, [2], {
      kind: "change_assignee",
      assignee: "Charlie",
    });
    expect(result.affectedIds).toContain(2);
    expect(result.updatedTasks.find((t) => t.id === 2)?.assignee).toBe(
      "charlie"
    );
  });

  it("appends tags to selected tasks without rewriting ids", () => {
    const clone = tasks.map((t) => ({ ...t, tags: t.tags ? [...t.tags] : [] }));
    const result = applyBulkAction(clone, [1], {
      kind: "append_tag",
      tag: "sprint",
    });
    expect(result.affectedIds.length).toBeGreaterThan(0);
    expect(result.updatedTasks.find((t) => t.id === 1)?.tags).toContain(
      "sprint"
    );
  });

  it("treats completed enum status as completed for selectable filter", () => {
    const ids = filterSelectableTaskIds(tasks, true);
    expect(ids).not.toContain(3);
  });
});
