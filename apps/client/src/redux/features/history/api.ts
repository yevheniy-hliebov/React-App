import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHistory = createAsyncThunk('history/fetchHistory', async () => {
  try {
    const response = await fetch('/api/history');
    const data = await response.json();
    if (data.success) {
      return data.history;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
});

export const fetchTasksHistory = createAsyncThunk('history/fetchTasksHistory', async (id: number) => {
  try {
    const response = await fetch(`/api/history/tasks/${id}`);
    const data = await response.json();
    if (data.success) {
      return data.task_history;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
});