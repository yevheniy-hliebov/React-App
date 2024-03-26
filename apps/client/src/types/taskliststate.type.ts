import { ErrorResponse } from "./error-response.type";
import { Task } from "./task.type";
import { TaskList } from "./tasklist.type";

export type TaskListState = {
  data: TaskList[] | null;
  fetchTaskList: {
    isLoading: boolean;
    isError: boolean;
    error: ErrorResponse | null;
  },
  fetchAddTaskList: {
    isLoading: boolean;
    data: TaskList | null;
    isError: boolean;
    error: ErrorResponse | null;
  },
  fetchEditTaskList: {
    isLoading: boolean;
    data: TaskList | null;
    isError: boolean;
    error: ErrorResponse | null;
  },
  fetchDeleteTaskList: {
    isLoading: boolean;
    data: TaskList | null;
    isError: boolean;
    error: ErrorResponse | null;
  },
  fetchMoveTask: {
    isLoading: boolean;
    data: Task | null;
    isError: boolean;
    error: ErrorResponse | null;
  },
}