import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskList } from '../../types/tasklist.type';
import { Task } from '../../types/task.type';
import { TaskListState } from '../../types/taskliststate.type';

const api = '/api';

export const fetchTaskList = createAsyncThunk('fetchTaskList', async () => {
  const response = await fetch(`${api}/tasklists?includeTasks=true`);  
  return await response.json();
})

export const fetchAddTaskList = createAsyncThunk('fetchAddTaskList', async (name: string) => {
  const response = await fetch(`${api}/tasklists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name }),
  });

  return await response.json();
});

type FetchEditTaskListProps = {
  tasklistId: number;
  moveTasksToId?: number;
  name: string;
}

export const fetchEditTaskList = createAsyncThunk('fetchEditTaskList', async ({ tasklistId, name }: FetchEditTaskListProps) => {
  const response = await fetch(`${api}/tasklists/${tasklistId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name }),
  });
  
  return await response.json();
});

type FetchDeleteTaskListProps = {
  tasklistId: number;
  moveTasksToId?: number;
}

export const fetchDeleteTaskList = createAsyncThunk('fetchDeleteTaskList', async ({tasklistId, moveTasksToId}: FetchDeleteTaskListProps) => {
  const response = await fetch(`${api}/tasklists/${tasklistId}${moveTasksToId ? `?movetoid=${moveTasksToId}` : ''}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return { response: await response.json(), moveTasksToId };
});

type FetchMoveTaskProps = {
  taskId: number;
  oldTaskListId: number;
  tasklistId: number;
}

export const fetchMoveTask = createAsyncThunk('moveTask', async ({ taskId, oldTaskListId, tasklistId }: FetchMoveTaskProps) => {
  const response = await fetch(`${api}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tasklist_id: tasklistId }),
  });

  return { response: await response.json(), oldTaskListId };
});

const initialState: TaskListState = {
  data: null,
  fetchTaskList: {
    isLoading: false,
    isError: false,
    error: null
  },
  fetchAddTaskList: {
    isLoading: false,
    data: null,
    isError: false,
    error: null
  },
  fetchEditTaskList: {
    isLoading: false,
    data: null,
    isError: false,
    error: null
  },
  fetchDeleteTaskList: {
    isLoading: false,
    data: null,
    isError: false,
    error: null
  },
  fetchMoveTask: {
    isLoading: false,
    data: null,
    isError: false,
    error: null
  },
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskList.pending, (state) => {
      state.fetchTaskList.isLoading = true;
    });
    builder.addCase(fetchTaskList.fulfilled, (state, action) => {     
      state.fetchTaskList.isLoading = false;
      if (action.payload['success'] === true) {
        state.data = action.payload['tasklists'];
      } else {
        state.fetchTaskList.isError = true;
        state.fetchTaskList.error = action.payload;
      }
    });

    builder.addCase(fetchAddTaskList.pending, (state) => {
      state.fetchTaskList.isLoading = true;
    });
    builder.addCase(fetchAddTaskList.fulfilled, (state, action) => {
      state.fetchAddTaskList.isLoading = false;
      if (action.payload['success'] === true && state.data) {
        state.fetchAddTaskList.data = action.payload['tasklist'];
        state.data.push(action.payload['tasklist']);
      } else {
        state.fetchAddTaskList.isError = true;
        state.fetchAddTaskList.error = action.payload;
      }
    });

    builder.addCase(fetchEditTaskList.pending, (state) => {
      state.fetchEditTaskList.isLoading = true;
    });
    builder.addCase(fetchEditTaskList.fulfilled, (state, action) => {
      state.fetchEditTaskList.isLoading = false;
      if (action.payload['success'] === true && state.data) {
        state.fetchEditTaskList.data = action.payload['tasklist'];
        state.data = state.data.map((taskList: TaskList) => {
          if (taskList.id === action.payload['tasklist'].id) {
            return { ...action.payload['tasklist'], tasks: taskList.tasks };
          } else {
            return taskList;
          }
        })
      } else {
        state.fetchEditTaskList.isError = true;
        state.fetchEditTaskList.error = action.payload;
      }
    });

    builder.addCase(fetchDeleteTaskList.pending, (state) => {
      state.fetchDeleteTaskList.isLoading = true;
    });
    builder.addCase(fetchDeleteTaskList.fulfilled, (state, action) => {
      state.fetchDeleteTaskList.isLoading = false;
      if (action.payload.response['success'] === true && state.data) {
        state.fetchDeleteTaskList.data = action.payload.response['tasklist'];
        if (action.payload.moveTasksToId) {        
          const targetTaskList = state.data.find((taskList: TaskList) => taskList.id === action.payload.moveTasksToId);
          const deletedTaskList = state.data.find((taskList: TaskList) => taskList.id === state.fetchDeleteTaskList.data?.id);
          
          if (targetTaskList) {
            // Move tasks from deleted task list to the target task list
            const tasksToMove = deletedTaskList?.tasks || [];
            targetTaskList.tasks = [...(targetTaskList.tasks || []), ...tasksToMove];
            state.data = state.data.map((taskList: TaskList) => {            
              if (taskList.id === targetTaskList.id) {
                return targetTaskList;
              } else {
                return taskList;
              }
            })
          }
        }
        state.data = state.data.filter((taskList: TaskList) => taskList.id !== action.payload.response['tasklist'].id)
      } else {
        state.fetchDeleteTaskList.isError = true;
        state.fetchDeleteTaskList.error = action.payload.response;
      }
    });

    builder.addCase(fetchMoveTask.pending, (state) => {
      state.fetchMoveTask.isLoading = true;
    });
    builder.addCase(fetchMoveTask.fulfilled, (state, action) => {
      state.fetchMoveTask.isLoading = false;
      if (action.payload.response.success === true && state.data) {
        state.fetchMoveTask.data = action.payload.response.task;
        const oldTaskListId = action.payload.oldTaskListId;
        const taskId = action.payload.response.task.id;
        const newTaskListId = action.payload.response.task.tasklist_id;

        // Find the old task list and remove the moved task from its tasks array
        const oldTaskList = state.data && state.data.find((list: TaskList) => list.id === oldTaskListId);
        if (oldTaskList) {
          oldTaskList.tasks = oldTaskList.tasks?.filter((task: Task) => task.id !== taskId);
        }

        // Find the new task list and add the moved task to its tasks array
        const newTaskList = state.data && state.data.find((list: TaskList) => list.id === newTaskListId);
        if (newTaskList) {
          newTaskList.tasks = [...(newTaskList.tasks || []), action.payload.response.task];
        }
      } else {
        state.fetchMoveTask.isError = true;
        state.fetchMoveTask.error = action.payload.response;
      }
    });
  }
});

export default taskSlice.reducer;