import { Size } from "@/app/shared/types/enums";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  size?: Size;
}

export type { PaginationProps };
