import { ReactNode } from "react";
import { SortDirection } from "@/app/shared/types/enums";

interface Column<T> {
  key: string;
  header: ReactNode;
  render: (item: T) => ReactNode;
  width?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (column: string) => void;
}

export type { Column, TableProps };
