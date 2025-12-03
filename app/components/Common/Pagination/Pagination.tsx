"use client";

import { Button, Group } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import styles from "./Pagination.module.css";
import type { PaginationProps } from "./Pagination.types";
import { Size } from "@/app/shared/types/enums";

export function Pagination({
  currentPage,
  totalPages,
  onChange,
  size = Size.SM,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push(-1);
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages - 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push(-1);
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Group gap={4}>
      <Button
        variant="subtle"
        size={size}
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
        className={styles.pageButton}
        aria-label="Previous page"
      >
        <IconChevronLeft size={16} />
      </Button>

      {getPageNumbers().map((pageNum, index) =>
        pageNum === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className={styles.ellipsis}
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "filled" : "subtle"}
            size={size}
            onClick={() => onChange(pageNum)}
            className={styles.pageButton}
            aria-label={`Go to page ${pageNum}`}
            aria-current={currentPage === pageNum ? "page" : undefined}
          >
            {pageNum}
          </Button>
        )
      )}

      <Button
        variant="subtle"
        size={size}
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
        className={styles.pageButton}
        aria-label="Next page"
      >
        <IconChevronRight size={16} />
      </Button>
    </Group>
  );
}
