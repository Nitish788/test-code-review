"use client";

import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";
import styles from "./Table.module.css";
import type { TableProps } from "./Table.types";

export function Table<T>({
  data,
  columns,
  onRowClick,
  className = "",
  sortColumn,
  sortDirection,
  onSort,
}: TableProps<T>) {
  const renderSortIcon = (column: string) => {
    if (!sortColumn || sortColumn !== column) {
      return <IconSelector size={14} className={styles.sortIcon} />;
    }
    return sortDirection === "asc" ? (
      <IconChevronUp size={14} className={styles.sortIcon} />
    ) : (
      <IconChevronDown size={14} className={styles.sortIcon} />
    );
  };

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <table className={styles.table}>
        <thead className={styles.header}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${styles.headerCell} ${
                  column.sortable ? styles.sortable : ""
                }`}
                style={{ width: column.width }}
                onClick={() => column.sortable && onSort?.(column.key)}
                role={column.sortable ? "button" : undefined}
                tabIndex={column.sortable ? 0 : undefined}
              >
                <span className={styles.headerContent}>
                  {column.header}
                  {column.sortable && (
                    <span className={styles.sortIconWrapper}>
                      {renderSortIcon(column.key)}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={styles.row}
              onClick={() => onRowClick?.(item)}
              data-clickable={!!onRowClick}
            >
              {columns.map((column) => (
                <td key={column.key} className={styles.cell}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
