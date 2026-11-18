import { BulkActionPayload } from "@/app/shared/types/bulk-action";
import { Task } from "@/app/shared/types/task";

export interface BulkActionBarProps {
  tasks: Task[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onApply: (action: BulkActionPayload) => void;
  pageIndex: number;
  pageSize: number;
  disabled?: boolean;
}
