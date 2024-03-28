export type Task = {
  id: number;
  name: string;
  description: string | null;
  due_date: string | Date | null;
  priority_id: number | null;
  tasklist_id: number;
  created_at: Date;
  updated_at: Date;
}

export type TasksState = {
  tasks: Task[];
  loading: boolean;
  error: string | null | undefined;
};

export type CreateTask = Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>> & { name: string, tasklist_id: number };

export type UpdateTask = Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>;