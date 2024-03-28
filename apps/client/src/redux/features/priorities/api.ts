import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPriorities = createAsyncThunk('priorities/fetchPriorities', async () => {
  try {
    const response = await fetch('/api/priorities');
    const data = await response.json();
    if (data.success) {
      return data.priorities;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
});