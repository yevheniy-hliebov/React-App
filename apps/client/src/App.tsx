import { useEffect } from 'react'
import Header from './components/Header';
import { TaskListFormProvider } from './context/TaskListFormContext';
import { store } from './redux/store';
import { useDispatch } from 'react-redux';
import { TaskListDeleteFormProvider } from './context/TaskListDeleteFormContext';
import Board from './components/Board';
import TaskListForm from './components/popups/TaskListForm';
import TaskListDeleteForm from './components/popups/TaskListDeleteForm';
import { fetchPriorities } from './redux/features/priorities/api';
import { fetchTaskLists } from './redux/features/taskLists/api';
import { fetchTasks } from './redux/features/tasks/api';

function App() {
  type AppDispatch = typeof store.dispatch;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchPriorities());
    dispatch(fetchTaskLists());
    dispatch(fetchTasks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App flex flex-col h-screen">
      <TaskListFormProvider>
        <TaskListDeleteFormProvider>
          <Header />
          <Board />

          {/* Popups TaskList */}
          <TaskListForm />
          <TaskListDeleteForm />
        </TaskListDeleteFormProvider>
      </TaskListFormProvider>
    </div>
  );
}

export default App
