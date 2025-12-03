import { Button, Group, Tooltip } from "@mantine/core";
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";

interface TaskTableHistoryProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function TaskTableHistory({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: TaskTableHistoryProps) {
  return (
    <Group gap="xs">
      <Tooltip label="Undo (Ctrl+Z)">
        <Button
          variant="subtle"
          size="sm"
          disabled={!canUndo}
          onClick={onUndo}
          leftSection={<IconArrowBackUp size={16} />}
          aria-label="Undo last action"
        >
          Undo
        </Button>
      </Tooltip>
      <Tooltip label="Redo (Ctrl+Y)">
        <Button
          variant="subtle"
          size="sm"
          disabled={!canRedo}
          onClick={onRedo}
          leftSection={<IconArrowForwardUp size={16} />}
          aria-label="Redo last undone action"
        >
          Redo
        </Button>
      </Tooltip>
    </Group>
  );
}
