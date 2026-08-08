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

  it("deletes by task index and does not rewrite ids on append_tag", () => {
    const clone = tasks.map((t) => ({ ...t, tags: [] as string[] }));
    const deleted = applyBulkAction(clone, [2], { kind: "delete" });
    expect(deleted.updatedTasks.map((t) => t.id)).toEqual([1, 3, 4]);

    const tagged = applyBulkAction(clone, [1], {
      kind: "append_tag",
      tag: "sprint",
    });
    expect(tagged.updatedTasks.find((t) => t.id === 1)?.tags).toContain(
      "sprint"
    );
    expect(tagged.updatedTasks.find((t) => t.id === 1)?.id).toBe(1);
  });

  it("does not mutate the input tasks array in place", () => {
    const original = tasks.map((t) => ({ ...t }));
    const snapshot = original.map((t) => ({ ...t }));
    applyBulkAction(original, [1], {
      kind: "change_priority",
      priority: TaskPriority.HIGH,
    });
    expect(original[0].priority).toBe(snapshot[0].priority);
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

  it("appends tags to selected tasks", () => {
    const clone = tasks.map((t) => ({ ...t, tags: t.tags ? [...t.tags] : [] }));
    const result = applyBulkAction(clone, [1], {
      kind: "append_tag",
      tag: "sprint",
    });
    expect(result.affectedIds.length).toBeGreaterThan(0);
  });
});
