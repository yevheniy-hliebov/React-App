import { createSlice } from '@reduxjs/toolkit';
import { TaskListsState } from './types';
import { createTaskList, deleteTaskList, fetchTaskLists, updateTaskList } from './api';

const initialState: TaskListsState = {
  taskLists: [],
  loading: false,
  error: null,
};

const taskListsSlice = createSlice({
  name: 'taskLists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskLists.fulfilled, (state, action) => {
        state.loading = false;
        state.taskLists = action.payload || [];
      })
      .addCase(fetchTaskLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTaskList.fulfilled, (state, action) => {
        state.taskLists.push(action.payload);
      })
      .addCase(updateTaskList.fulfilled, (state, action) => {
        const index = state.taskLists.findIndex((taskList) => taskList.id === action.payload.id);
        if (index !== -1) {
          state.taskLists[index] = action.payload;
        }
      })
      .addCase(deleteTaskList.fulfilled, (state, action) => {
        const index = state.taskLists.findIndex((taskList) => taskList.id === action.payload);
        if (index !== -1) {
          state.taskLists.splice(index, 1);
        }
      });
  },
});

export default taskListsSlice.reducer;
