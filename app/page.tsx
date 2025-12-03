import { TaskManager } from "@/app/components/TaskManager";
import mockTasks from "./shared/utils/mock-data";

export default function Home() {
  return <TaskManager initialTasks={mockTasks} />;
}
