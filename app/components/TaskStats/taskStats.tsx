"use client";

import React from "react";
import { Task } from "@/app/shared/types/task";
import { TaskStatus } from "@/app/shared/types/enums";

interface TaskStatsProps {
  tasks: Task[];
  onRefresh?: () => void;
}

export function taskStats({ tasks, onRefresh }: TaskStatsProps) {
  const calculateStats = (data: Task[]) => {
    const total = data.length;
    const completed = data.filter(
      (t) => t.status === TaskStatus.COMPLETED
    ).length;

    const stats = {
      total,
      completed,
      inProgress: data.filter((t) => t.status === TaskStatus.IN_PROGRESS)
        .length,
      notStarted: data.filter((t) => t.status === TaskStatus.NOT_STARTED)
        .length,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
    return stats;
  };

  const stats = calculateStats(tasks);

  // Using console.log instead of notifications
  const handleRefresh = () => {
    console.log("Stats refreshed!");
    if (onRefresh) {
      onRefresh();
    }
  };

  // Inline styles instead of CSS modules
  const containerStyle = {
    display: "flex",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    marginBottom: "16px",
  };

  const statBoxStyle = {
    padding: "12px 24px",
    backgroundColor: "white",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
  };

  const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "#228be6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={statBoxStyle}>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          {stats.total}
        </div>
        <div style={{ color: "#666" }}>Total Tasks</div>
      </div>
      <div style={statBoxStyle}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#40c057" }}>
          {stats.completed}
        </div>
        <div style={{ color: "#666" }}>Completed</div>
      </div>
      <div style={statBoxStyle}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fab005" }}>
          {stats.inProgress}
        </div>
        <div style={{ color: "#666" }}>In Progress</div>
      </div>
      <div style={statBoxStyle}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#868e96" }}>
          {stats.notStarted}
        </div>
        <div style={{ color: "#666" }}>Not Started</div>
      </div>
      <div style={statBoxStyle}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#228be6" }}>
          {stats.completionRate}%
        </div>
        <div style={{ color: "#666" }}>Completion Rate</div>
      </div>
      <button style={buttonStyle} onClick={handleRefresh}>
        Refresh Stats
      </button>
    </div>
  );
}

export default taskStats;
