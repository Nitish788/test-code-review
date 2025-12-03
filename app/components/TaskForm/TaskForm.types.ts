import { Task } from "@/app/shared/types/task";
import type { CustomField } from "@/app/shared/types/custom-field";

interface TaskFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id">) => void;
  initialValues?: Partial<Task>;
  title: string;
  customFields?: CustomField[];
}

export type { TaskFormProps };
