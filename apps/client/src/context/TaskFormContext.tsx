import { createContext, useContext, useState } from "react";
import { Task } from "../redux/features/tasks/types";

type TaskFormType = {
  isOpen: boolean;
  tasklist_id?: number;
  task?: Task;
  isEditTaskForm?: boolean;
  openTaskForm: (props: TaskFromProps) => void;
  closeTaskForm: () => void;
};

const TaskFormContext = createContext<TaskFormType | undefined>(undefined);

export const useTaskForm = () => {
  const context = useContext(TaskFormContext);
  if (!context) {
    throw new Error('useTaskForm must be used within a TaskFormProvider');
  }
  return context;
};

type TaskFormProviderProps = {
  children?: React.ReactNode;
}

export type TaskFromProps = {
  tasklist_id?: number;
  task?: Task;
  isEditTaskForm?: boolean;
}

export const TaskFormProvider: React.FC<TaskFormProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tasklist_id, setTaskList] = useState<number | undefined>(undefined);
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [isEditTaskForm, setIsEditTaskForm] = useState<boolean>(false);

  const openTaskForm = ({ tasklist_id, task, isEditTaskForm }: TaskFromProps) => {
    setIsOpen(true);
    setTaskList(tasklist_id);
    setTask(task);
    setIsEditTaskForm(isEditTaskForm || false);
  };

  const closeTaskForm = () => {
    setIsOpen(false);
    setTaskList(undefined);
    setTask(undefined);
    setIsEditTaskForm(false);
  };

  return (
    <TaskFormContext.Provider value={{ isOpen, tasklist_id, task, isEditTaskForm, openTaskForm, closeTaskForm }}>
      {children}
    </TaskFormContext.Provider>
  );
};