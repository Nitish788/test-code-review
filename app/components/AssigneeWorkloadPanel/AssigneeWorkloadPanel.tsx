"use client";

import { useMemo } from "react";
import {
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Divider,
} from "@mantine/core";
import { Task } from "@/app/shared/types/task";
import {
  buildAssigneeWorkload,
  findHeaviestAssignee,
  formatWorkloadExport,
} from "@/app/shared/utils/assignee-workload";

interface AssigneeWorkloadPanelProps {
  tasks: Task[];
  nowIso?: string;
}

export function AssigneeWorkloadPanel({
  tasks,
  nowIso,
}: AssigneeWorkloadPanelProps) {
  const summary = useMemo(
    () => buildAssigneeWorkload(tasks, { nowIso }),
    [tasks, nowIso]
  );

  const heaviest = findHeaviestAssignee(summary);
  const exportText = formatWorkloadExport(summary);

  return (
    <Card withBorder padding="md" mb="md" aria-label="Assignee workload">
      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={4}>Assignee workload</Title>
          <Badge variant="light">
            {summary.totalAssignees} people · {summary.totalOpenTasks} open
          </Badge>
        </Group>

        {heaviest && (
          <Text size="sm" c="dimmed">
            Highest load:{" "}
            <Text span fw={600}>
              {heaviest.assignee}
            </Text>{" "}
            ({heaviest.openCount} open)
          </Text>
        )}

        <Divider />

        <Stack gap="xs">
          {summary.rows.map((row) => (
            <Group key={row.assignee} justify="space-between" wrap="nowrap">
              <Text size="sm">
                <Text span fw={600}>
                  {row.assignee}
                </Text>{" "}
                ({row.openCount} open)
              </Text>
              <Group gap="xs">
                <Badge size="sm" color="orange">
                  {row.overdueCount} overdue
                </Badge>
                <Badge size="sm" variant="outline">
                  {String(row.storyPoints)} pts
                </Badge>
              </Group>
            </Group>
          ))}
          {summary.rows.length === 0 && (
            <Text size="sm" c="dimmed">
              No assignee workload yet.
            </Text>
          )}
        </Stack>

        <Text size="xs" c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
          {exportText}
        </Text>
      </Stack>
    </Card>
  );
}
