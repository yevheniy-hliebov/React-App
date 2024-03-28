import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreateTask, UpdateTask } from './types';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  try {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    if (data.success) {
      return data.tasks;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (task: CreateTask) => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const data = await response.json();
    if (data.success) {
      return data.task;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, task }: { id: number; task: UpdateTask; }) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const data = await response.json();
    if (data.success) {
      return data.task;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number) => { 
  try {
    const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    const data = await response.json();
        
    if (data.success) {
      return id;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {    
    throw error;
  }
});
