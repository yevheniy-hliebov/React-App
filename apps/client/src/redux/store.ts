import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from "./slice/tasks";
import prioritiesReducer, { PrioritiesState } from "./slice/priorities";
import { TaskListState } from '../types/taskliststate.type';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    priorities: prioritiesReducer
  }
})

export type State = {
  tasks: TaskListState,
  priorities: PrioritiesState
}