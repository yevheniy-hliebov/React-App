import { createContext, useContext, useState } from "react";
import { TaskList } from "../redux/features/taskLists/types";

type TaskListDeleteFormType = {
  isOpen: boolean;
  tasklist?: TaskList;
  openTaskListDeleteForm: (tasklist: TaskList) => void;
  closeForm: () => void;
};

const TaskListDeleteFormContext = createContext<TaskListDeleteFormType | undefined>(undefined);

export const useTaskListDeleteForm = () => {
  const context = useContext(TaskListDeleteFormContext);
  if (!context) {
    throw new Error('useTaskListDeleteForm must be used within a TaskListDeleteFormProvider');
  }
  return context;
};

type TaskListDeleteFormProviderProps = {
  children?: React.ReactNode;
}

export const TaskListDeleteFormProvider: React.FC<TaskListDeleteFormProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tasklist, setTaskList] = useState<TaskList | undefined>(undefined);

  const openTaskListDeleteForm = (tasklist: TaskList) => {
    setIsOpen(true);
    setTaskList(tasklist);
  };
  
  const closeForm = () => {
    setIsOpen(false);
    setTaskList(undefined);
  };

  return (
    <TaskListDeleteFormContext.Provider value={{ isOpen, tasklist, openTaskListDeleteForm, closeForm }}>
      {children}
    </TaskListDeleteFormContext.Provider>
  );
};