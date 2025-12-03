"use client";

import { SegmentedControl } from "@mantine/core";
import { IconLayoutKanban, IconTable } from "@tabler/icons-react";
import styles from "./ViewToggle.module.css";
import type { ViewToggleProps } from "./ViewToggle.types";
import { ViewMode } from "@/app/shared/types/enums";

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <SegmentedControl
      value={view}
      onChange={(value) => onChange(value as ViewMode)}
      data={[
        {
          value: ViewMode.TABLE,
          label: (
            <div className={styles.controlItem}>
              <IconTable size={16} />
              <span>Table</span>
            </div>
          ),
        },
        {
          value: ViewMode.KANBAN,
          label: (
            <div className={styles.controlItem}>
              <IconLayoutKanban size={16} />
              <span>Kanban</span>
            </div>
          ),
        },
      ]}
    />
  );
}
