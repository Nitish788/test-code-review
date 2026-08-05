import {
  buildAssigneeWorkload,
  findHeaviestAssignee,
  formatWorkloadExport,
  groupTasksByAssignee,
} from "@/app/shared/utils/assignee-workload";
import { TaskPriority, TaskStatus } from "@/app/shared/types/enums";
import { Task } from "@/app/shared/types/task";

function makeTask(partial: Partial<Task> & { id: number; title: string }): Task {
  return {
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.IN_PROGRESS,
    assignee: "Ada",
    storyPoints: 3,
    dueDate: "2099-01-01",
    ...partial,
  };
}

describe("assignee-workload", () => {
  const tasks: Task[] = [
    makeTask({ id: 1, title: "A1", assignee: "Ada", storyPoints: 5 }),
    makeTask({ id: 2, title: "A2", assignee: "Ada", storyPoints: 2 }),
    makeTask({
      id: 3,
      title: "B1",
      assignee: "Bob",
      storyPoints: 8,
      status: TaskStatus.NOT_STARTED,
    }),
  ];

  it("groups tasks by assignee", () => {
    const groups = groupTasksByAssignee(tasks);
    expect(groups.get("ada")?.length).toBe(2);
    expect(groups.get("bob")?.length).toBe(1);
  });

  it("builds workload summary rows", () => {
    const summary = buildAssigneeWorkload(tasks, {
      nowIso: "2026-01-01T00:00:00.000Z",
    });
    expect(summary.totalAssignees).toBe(2);
    expect(summary.rows.length).toBe(2);
    expect(findHeaviestAssignee(summary)?.assignee).toBeTruthy();
  });

  it("formats workload export text", () => {
    const summary = buildAssigneeWorkload(tasks);
    const text = formatWorkloadExport(summary);
    expect(text).toContain("Assignees:");
    expect(text.toLowerCase()).toContain("ada");
  });
});
