import { configureStore } from '@reduxjs/toolkit';
import taskListsReducer from './features/taskLists/taskListsSlice';
import prioritiesReducer from './features/priorities/prioritiesSlice';
import tasksReducer from './features/tasks/tasksSlice';
import { TasksState } from './features/tasks/types';
import { PrioritiesState } from './features/priorities/types';
import { TaskListsState } from './features/taskLists/types';

export const store = configureStore({
  reducer: {
    tasklists: taskListsReducer,
    tasks: tasksReducer,
    priorities: prioritiesReducer
  }
})

export type State = {
  tasklists: TaskListsState,
  tasks: TasksState,
  priorities: PrioritiesState
}