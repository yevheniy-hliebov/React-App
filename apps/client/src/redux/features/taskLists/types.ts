import { Task } from "../tasks/types";

export type TaskList = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  tasks?: Task[];
};

export type TaskListsState = {
  taskLists: TaskList[];
  loading: boolean;
  error: string | null | undefined;
};

export type CreateTaskList = Omit<TaskList, 'id' | 'created_at' | 'updated_at'>;

export type UpdateTaskList = Partial<Omit<TaskList, 'id' | 'created_at' | 'updated_at' | 'tasks'>>;