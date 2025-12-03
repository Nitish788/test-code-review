"use client";

import { Title, Box, Skeleton, Group } from "@mantine/core";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { tasksStorage } from "@/app/shared/utils/tasks-storage";
import { Task } from "@/app/shared/types/task";

interface TaskManagerContainerProps {
  initialTasks: Task[];
}

const TaskTable = dynamic(
  () => import("@/app/components/TaskTable").then((mod) => mod.TaskTable),
  {
    loading: () => (
      <>
        <Skeleton
          height={40}
          radius="sm"
          mb="md"
          aria-label="Loading task controls..."
        />
        <Skeleton height={400} radius="sm" aria-label="Loading task list..." />
      </>
    ),
  }
);

const StartFreshButton = dynamic(
  () => import("./StartFreshButton").then((mod) => mod.StartFreshButton),
  {
    ssr: false,
  }
);

export function TaskManagerContainer({
  initialTasks,
}: TaskManagerContainerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTasks = tasksStorage.getTasks();
    setTasks(storedTasks.length > 0 ? storedTasks : initialTasks);
    setIsLoading(false);
  }, [initialTasks]);

  return (
    <Box size="xl" p="xl" role="main" aria-label="Task Management Application">
      <Box ta="center" mb="lg">
        <Group justify="center" gap="md" role="banner">
          <Title order={1}>Task Management</Title>
          <StartFreshButton />
        </Group>
      </Box>
      {isLoading ? <TaskTable tasks={tasks} /> : <TaskTable tasks={tasks} />}
    </Box>
  );
}
