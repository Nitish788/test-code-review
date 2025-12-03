import { FieldType } from "@/app/shared/types/enums";

interface BaseField {
  type: FieldType;
  name: string;
  label: string;
  required?: boolean;
}

interface TextField extends BaseField {
  type: FieldType.TEXT;
  placeholder?: string;
}

interface RadioField extends BaseField {
  type: FieldType.RADIO;
  options: { value: string; label: string }[];
}

interface CheckboxField extends BaseField {
  type: FieldType.CHECKBOX;
}

interface NumberField extends BaseField {
  type: FieldType.NUMBER;
  placeholder?: string;
}

interface SelectField extends BaseField {
  type: FieldType.SELECT;
  options: { value: string; label: string }[];
  placeholder?: string;
}

type Field = TextField | RadioField | CheckboxField | NumberField | SelectField;

interface FormProps {
  fields: Field[];
  onSubmit: (values: Record<string, string | boolean>) => void;
  initialValues?: Record<string, string | boolean>;
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  title?: string;
}

export type { FieldType, BaseField, Field, FormProps };
