import React, { createContext, useContext, useState } from 'react';
import { TaskList } from '../types/tasklist.type';

export type TaskListFromProps = {
  title?: string;
  tasklist?: TaskList;
  isEditForm?: boolean;
}

type TaskListFormContextType = {
  isOpen: boolean;
  title?: string; 
  tasklist?: TaskList; 
  isEditForm?: boolean; 
  openTaskListForm: (props?: TaskListFromProps) => void;
  closeForm: () => void;
};

const TaskListFormContext = createContext<TaskListFormContextType | undefined>(undefined);

export const useTaskListForm = () => {
  const context = useContext(TaskListFormContext);
  if (!context) {
    throw new Error('useTaskListForm must be used within a TaskListFormProvider');
  }
  return context;
};


type TaskListFormProviderProps = {
  children?: React.ReactNode;
}

export const TaskListFormProvider: React.FC<TaskListFormProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [tasklist, setTaskList] = useState<TaskList | undefined>(undefined);
  const [isEditForm, setIsEditForm] = useState<boolean>(false);

  // 
  const openTaskListForm = (props?: TaskListFromProps) => {
    setIsOpen(true);
    setTitle(props?.title);
    setTaskList(props?.tasklist);
    setIsEditForm(props?.isEditForm || false);
  };

  const closeForm = () => {
    setIsOpen(false);
    setTitle(undefined);
    setTaskList(undefined);
    setIsEditForm(false);
  };

  return (
    <TaskListFormContext.Provider value={{ isOpen, title, tasklist, isEditForm, openTaskListForm, closeForm }}>
      {children}
    </TaskListFormContext.Provider>
  );
};
