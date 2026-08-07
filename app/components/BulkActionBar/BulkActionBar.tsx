"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Group,
  Select,
  TextInput,
  Text,
  Paper,
  Stack,
} from "@mantine/core";
import { IconTrash, IconUser, IconFlag, IconTags } from "@tabler/icons-react";
import { TaskPriority, TaskStatus } from "@/app/shared/types/enums";
import { BulkActionPayload } from "@/app/shared/types/bulk-action";
import {
  computeSelectionStats,
  describeBulkAction,
  filterSelectableTaskIds,
  resolveSelectedIdsForPage,
} from "@/app/shared/utils/bulk-task-ops";
import { BulkActionBarProps } from "./BulkActionBar.types";

export function BulkActionBar({
  tasks,
  selectedIds,
  onSelectionChange,
  onApply,
  pageIndex,
  pageSize,
  disabled = false,
}: BulkActionBarProps) {
  const [status, setStatus] = useState<string | null>(TaskStatus.IN_PROGRESS);
  const [priority, setPriority] = useState<string | null>(TaskPriority.MEDIUM);
  const [assignee, setAssignee] = useState("");
  const [tag, setTag] = useState("bulk");

  const pageSelectedIds = useMemo(
    () => resolveSelectedIdsForPage(selectedIds, pageIndex, pageSize),
    [selectedIds, pageIndex, pageSize]
  );

  const stats = useMemo(
    () => computeSelectionStats(tasks, pageSelectedIds),
    [tasks, pageSelectedIds]
  );

  const selectableCount = filterSelectableTaskIds(tasks).length;

  const apply = (action: BulkActionPayload) => {
    onSelectionChange(pageSelectedIds);
    onApply(action);
    onSelectionChange([]);
  };

  if (selectedIds.length === 0) {
    return (
      <Paper p="sm" withBorder mb="md">
        <Text size="sm" c="dimmed">
          Select tasks to enable bulk actions ({selectableCount} selectable).
        </Text>
      </Paper>
    );
  }

  return (
    <Paper p="md" withBorder mb="md" aria-label="Bulk task actions">
      <Stack gap="sm">
        <Group justify="space-between">
          <Text size="sm" fw={600}>
            {stats.count} selected · pts {String(stats.storyPoints)} ·{" "}
            {describeBulkAction({ kind: "change_status", status: status ?? "" })}
          </Text>
          <Button
            variant="subtle"
            size="xs"
            onClick={() => onSelectionChange([])}
            disabled={disabled}
          >
            Clear selection
          </Button>
        </Group>

        <Group align="flex-end" grow>
          <Select
            label="Status"
            data={[
              { value: TaskStatus.NOT_STARTED, label: "Not Started" },
              { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
              { value: TaskStatus.COMPLETED, label: "Completed" },
            ]}
            value={status}
            onChange={setStatus}
          />
          <Button
            leftSection={<IconFlag size={16} />}
            disabled={disabled || !status}
            onClick={() =>
              apply({ kind: "change_status", status: status ?? undefined })
            }
          >
            Apply status
          </Button>
        </Group>

        <Group align="flex-end" grow>
          <Select
            label="Priority"
            data={[
              { value: TaskPriority.URGENT, label: "Urgent" },
              { value: TaskPriority.HIGH, label: "High" },
              { value: TaskPriority.MEDIUM, label: "Medium" },
              { value: TaskPriority.LOW, label: "Low" },
              { value: TaskPriority.NONE, label: "None" },
            ]}
            value={priority}
            onChange={setPriority}
          />
          <Button
            leftSection={<IconFlag size={16} />}
            disabled={disabled || !priority}
            onClick={() =>
              apply({
                kind: "change_priority",
                priority: priority ?? undefined,
              })
            }
          >
            Apply priority
          </Button>
        </Group>

        <Group align="flex-end" grow>
          <TextInput
            label="Assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.currentTarget.value)}
            placeholder="name@team"
          />
          <Button
            leftSection={<IconUser size={16} />}
            disabled={disabled || !assignee.trim()}
            onClick={() =>
              apply({ kind: "change_assignee", assignee: assignee.trim() })
            }
          >
            Assign
          </Button>
        </Group>

        <Group align="flex-end" grow>
          <TextInput
            label="Tag"
            value={tag}
            onChange={(e) => setTag(e.currentTarget.value)}
          />
          <Button
            leftSection={<IconTags size={16} />}
            disabled={disabled}
            onClick={() => apply({ kind: "append_tag", tag })}
          >
            Append tag
          </Button>
        </Group>

        <Button
          color="red"
          variant="light"
          leftSection={<IconTrash size={16} />}
          disabled={disabled}
          onClick={() => apply({ kind: "delete" })}
        >
          Delete selected
        </Button>
      </Stack>
    </Paper>
  );
}
