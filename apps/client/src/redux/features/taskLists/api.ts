import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateTaskList, UpdateTaskList } from "./types";

export const fetchTaskLists = createAsyncThunk('taskLists/fetchTaskLists', async () => {
  try {
    const response = await fetch(`/api/tasklists`);
    const data = await response.json();    
    if (data.success) {
      return data.tasklists;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
});

export const createTaskList = createAsyncThunk('taskLists/createTaskList', async (taskList: CreateTaskList) => {
  try {
    const response = await fetch('/api/tasklists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskList),
    });
    const data = await response.json();
    if (data.success) {
      return data.tasklist;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
});

export const updateTaskList = createAsyncThunk('taskLists/updateTaskList', async ({ id, taskList }: { id: number; taskList: UpdateTaskList; }) => {
  try {
    const response = await fetch(`/api/tasklists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskList),
    });
    const data = await response.json();
    if (data.success) {
      return data.tasklist;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
});

export const deleteTaskList = createAsyncThunk('taskLists/deleteTaskList', async ({id, moveTasksToId }: {id: number, moveTasksToId?: number }) => {
  try {
    const response = await fetch(`/api/tasklists/${id}${moveTasksToId ? `?movetoid=${moveTasksToId}` : ''}`, { method: 'DELETE' });
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