import { Task } from "./task.type";

export type TaskList = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  tasks?: Task[];
}