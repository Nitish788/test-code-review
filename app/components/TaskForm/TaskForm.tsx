"use client";

import { Modal } from "@mantine/core";
import { Form } from "../Common/Form/Form";
import { Field } from "../Common/Form/Form.types";
import { useMemo } from "react";
import type { TaskFormProps } from "./TaskForm.types";
import { FieldType, TaskPriority, TaskStatus } from "@/app/shared/types/enums";

export function TaskForm({
  opened,
  onClose,
  onSubmit,
  initialValues,
  title,
  customFields = [],
}: TaskFormProps) {
  const fields: Field[] = useMemo(
    () => [
      {
        type: FieldType.TEXT,
        name: "title",
        label: "Title",
        placeholder: "Enter task title",
        required: true,
      },
      {
        type: FieldType.RADIO,
        name: "priority",
        label: "Priority",
        required: true,
        options: [
          { value: "high", label: "High" },
          { value: "urgent", label: "Urgent" },
          { value: "medium", label: "Medium" },
          { value: "low", label: "Low" },
          { value: "none", label: "None" },
        ],
      },
      {
        type: FieldType.RADIO,
        name: "status",
        label: "Status",
        required: true,
        options: [
          { value: "not_started", label: "Not Started" },
          { value: "in_progress", label: "In Progress" },
          { value: "completed", label: "Completed" },
        ],
      },
      ...customFields.map((field): Field => {
        switch (field.type) {
          case "checkbox":
            return {
              type: FieldType.CHECKBOX,
              name: field.name,
              label: field.name,
            };
          case "number":
            return {
              type: FieldType.NUMBER,
              name: field.name,
              label: field.name,
              placeholder: `Enter ${field.name.toLowerCase()}`,
            };
          default:
            return {
              type: FieldType.TEXT,
              name: field.name,
              label: field.name,
              placeholder: `Enter ${field.name.toLowerCase()}`,
            };
        }
      }),
    ],
    [customFields]
  );

  const handleSubmit = (values: Record<string, string | boolean>) => {
    const customFieldValues: Record<string, string | number | boolean> = {};
    customFields.forEach((field) => {
      if (field.type === "number") {
        customFieldValues[field.name] = Number(values[field.name]);
      } else if (field.type === "checkbox") {
        customFieldValues[field.name] = Boolean(values[field.name]);
      } else {
        customFieldValues[field.name] = String(values[field.name]);
      }
    });

    onSubmit({
      title: String(values.title),
      priority: String(values.priority) as TaskPriority,
      status: String(values.status) as TaskStatus,
      customFields: customFieldValues,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      styles={{
        header: {
          borderBottom: "1px solid var(--mantine-color-gray-2)",
          marginBottom: "var(--mantine-spacing-md)",
          paddingBottom: "var(--mantine-spacing-xs)",
        },
      }}
    >
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={
          initialValues && {
            title: initialValues.title ?? "",
            priority: initialValues.priority ?? TaskPriority.NONE,
            status: initialValues.status ?? TaskStatus.NOT_STARTED,
            ...(initialValues.customFields ?? {}),
          }
        }
        onCancel={onClose}
        submitLabel="Save Task"
      />
    </Modal>
  );
}
