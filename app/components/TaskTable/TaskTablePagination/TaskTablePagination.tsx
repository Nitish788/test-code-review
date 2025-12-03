"use client";

import { Group, Select, Text } from "@mantine/core";
import { Pagination } from "../../Common/Pagination/Pagination";
import { Size } from "@/app/shared/types/enums";

interface TaskTablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string | null) => void;
}

export function TaskTablePagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: TaskTablePaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <Group mt="md" justify="space-between" align="center">
      <Group gap="xs">
        <Text size="sm" c="dimmed">
          Rows per page:
        </Text>
        <Select
          value={pageSize.toString()}
          onChange={onPageSizeChange}
          data={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          size="xs"
          style={{ width: 80 }}
        />
      </Group>

      <Group gap="xs" align="center">
        <Text size="sm" c="dimmed">
          {`${(currentPage - 1) * pageSize + 1}-${Math.min(
            currentPage * pageSize,
            totalItems
          )} of ${totalItems}`}
        </Text>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={onPageChange}
          size={Size.SM}
        />
      </Group>
    </Group>
  );
}
