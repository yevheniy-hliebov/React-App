import { configureStore } from '@reduxjs/toolkit';
import taskListsReducer from './features/taskLists/taskListsSlice';
import prioritiesReducer from './features/priorities/prioritiesSlice';
import tasksReducer from './features/tasks/tasksSlice';
import historyReducer from './features/history/historySlice';
import taskHistoryReducer from './features/history/taskHistorySlice';
import { TasksState } from './features/tasks/types';
import { PrioritiesState } from './features/priorities/types';
import { TaskListsState } from './features/taskLists/types';
import { HistoryState } from './features/history/types';

export const store = configureStore({
  reducer: {
    tasklists: taskListsReducer,
    tasks: tasksReducer,
    priorities: prioritiesReducer,
    history: historyReducer,
    taskHistory: taskHistoryReducer,
  }
})

export type State = {
  tasklists: TaskListsState,
  tasks: TasksState,
  priorities: PrioritiesState,
  history: HistoryState,
  taskHistory: HistoryState,
}