"use client";

import { Button, Group, Modal, Text } from "@mantine/core";
import styles from "./ConfirmationModal.module.css";
import type { ConfirmationModalProps } from "./ConfirmationModal.types";

export function ConfirmationModal({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: ConfirmationModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      className={styles.modal}
      styles={{
        header: {
          borderBottom: "1px solid var(--mantine-color-gray-2)",
          marginBottom: "var(--mantine-spacing-md)",
          paddingBottom: "var(--mantine-spacing-xs)",
        },
      }}
    >
      <Text size="sm" mb="lg" className={styles.message}>
        {message}
      </Text>
      <Group justify="flex-end" gap="xs">
        <Button variant="subtle" size="sm" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button color="red" size="sm" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}
