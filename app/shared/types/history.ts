import { Task } from "./task";

export interface CreateAction {
  type: "CREATE";
  data: Task;
}

export interface UpdateAction {
  type: "UPDATE";
  data: Task;
  previousData: Task;
}

export interface DeleteAction {
  type: "DELETE";
  data: Pick<Task, "id">;
  previousData: Task;
  index?: number;
}

export type HistoryAction = CreateAction | UpdateAction | DeleteAction;

export type HistoryState = {
  past: HistoryAction[];
  future: HistoryAction[];
};
