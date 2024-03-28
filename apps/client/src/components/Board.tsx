import TaskList from './tasklist/TaskList'
import Container from './Container'
import { TaskList as TaskListType } from '../redux/features/taskLists/types'
import { useSelector } from 'react-redux';
import { State } from '../redux/store';
import HeaderTaskList from './tasklist/HeaderTaskList';
import ButtonAddCard from './tasklist/ButtonAddCard';
import { TaskFormProvider } from '../context/TaskFormContext';
import TaskForm from './popups/TaskForm';
import Loader from '../assets/loader.svg?react'

function Board() {
  const stateTaskLists = useSelector((state: State) => state.tasklists);
  const stateTasks = useSelector((state: State) => state.tasks);

  const tasklists = stateTaskLists.taskLists;
  const tasklistsWithTasks = tasklists.map((tasklist) => {
    const tasks = stateTasks.tasks.filter(task => tasklist.id === task.tasklist_id);
    return { ...tasklist, tasks };
  })

  return (
    <TaskFormProvider>
      <Container className={`relative flex-1 flex flex-col ${(stateTaskLists.loading || stateTasks.loading) ? 'overflow-hidden' : 'overflow-auto'} transition-all`}>
        <div className={`loader-block absolute z-50 inset-0 w-full h-full bg-white pointer-events-none ${(stateTaskLists.loading || stateTasks.loading) ? 'opacity-100' : 'opacity-0'} transition-all`}>
          <Loader className='mx-auto mt-10' />
        </div>
        <div className={`board relative flex-1 ${(stateTaskLists.loading || stateTasks.loading) ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-all`}>
          <div className="board__wrapper relative">
            <div className="board__header sticky z-[20] top-0 left-0 flex">
              {tasklistsWithTasks.map((tasklist: TaskListType) => {
                return (
                  <div key={'board__column-header' + tasklist.id} className='board__column-header shrink-0 w-[300px] flex flex-col gap-[15px] pr-[25px] bg-white pb-6'>
                    <HeaderTaskList tasklist={tasklist} count_tasks={tasklist.tasks?.length || 0} />
                    <ButtonAddCard tasklist_id={tasklist.id} />
                  </div>
                )
              })}
            </div>
            <div className="board__column-list flex pb-[188px]">
              {tasklistsWithTasks.map((tasklist: TaskListType) => {
                return <TaskList key={tasklist.id} tasklist={tasklist} />
              })}
            </div>
          </div>
        </div>
      </Container>
      <TaskForm />
    </TaskFormProvider>
  )
}

export default Board