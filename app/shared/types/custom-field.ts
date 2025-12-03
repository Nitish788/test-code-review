import { CustomFieldType } from "./enums";

export interface CustomField {
  id: string;
  name: string;
  type: CustomFieldType;
}
