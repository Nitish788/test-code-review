import type { CustomField } from "@/app/shared/types/custom-field";

interface CustomFieldsManagerProps {
  opened: boolean;
  onClose: () => void;
  customFields: CustomField[];
  onAddField: (field: Omit<CustomField, "id">) => void;
  onRemoveField: (fieldId: string) => void;
}
interface CustomFieldsManagerPresentationProps {
  opened: boolean;
  onClose: () => void;
  customFields: CustomField[];
  onSubmit: (values: Record<string, string | boolean>) => void;
  onRemoveField: (fieldId: string) => void;
  error: string | null;
}

export type { CustomFieldsManagerProps, CustomFieldsManagerPresentationProps };
