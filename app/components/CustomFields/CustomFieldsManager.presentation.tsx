import { Button, Group, Modal, Stack, Text, Alert } from "@mantine/core";
import { Form } from "../Common/Form/Form";
import { Field } from "../Common/Form/Form.types";
import { useMemo } from "react";
import styles from "./CustomFieldsManager.module.css";
import { IconTrash, IconAlertCircle } from "@tabler/icons-react";
import type { CustomFieldsManagerPresentationProps } from "./CustomFieldsManager.types";
import { FieldType } from "@/app/shared/types/enums";

export function CustomFieldsManagerPresentation({
  opened,
  onClose,
  customFields,
  onSubmit,
  onRemoveField,
  error,
}: CustomFieldsManagerPresentationProps) {
  const fields: Field[] = useMemo(
    () => [
      {
        type: FieldType.TEXT,
        name: "name",
        label: "Field Name",
        placeholder: "Enter field name",
        required: true,
      },
      {
        type: FieldType.SELECT,
        name: "type",
        label: "Field Type",
        required: true,
        placeholder: "Select field type",
        options: [
          { value: "text", label: "Text" },
          { value: "number", label: "Number" },
          { value: "checkbox", label: "Checkbox" },
        ],
      },
    ],
    []
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Manage Custom Fields"
      size="lg"
    >
      <Stack>
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            title="Error"
            variant="light"
          >
            {error}
          </Alert>
        )}
        <div className={styles.existingFields}>
          <Text size="sm" fw={500} mb="xs">
            Existing Custom Fields
          </Text>
          {customFields.length === 0 ? (
            <Text size="sm" c="dimmed">
              No custom fields added yet
            </Text>
          ) : (
            customFields.map((field) => (
              <Group key={field.id} justify="space-between" mb="xs">
                <div>
                  <Text size="sm">{field.name}</Text>
                  <Text size="xs" c="dimmed">
                    Type: {field.type}
                  </Text>
                </div>
                <Button
                  variant="subtle"
                  color="red"
                  size="xs"
                  onClick={() => onRemoveField(field.id)}
                >
                  <IconTrash size={16} />
                </Button>
              </Group>
            ))
          )}
        </div>
        <div>
          <Text size="sm" fw={500} mb="xs">
            Add New Field
          </Text>
          <Form fields={fields} onSubmit={onSubmit} submitLabel="Add Field" />
        </div>
      </Stack>
    </Modal>
  );
}
