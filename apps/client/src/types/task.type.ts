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