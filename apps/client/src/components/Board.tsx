import TaskList from './tasklist/TaskList'
import Container from './Container'
import { TaskList as TaskListType } from '../types/tasklist.type'
import { useSelector } from 'react-redux';
import { State } from '../redux/store';
import HeaderTaskList from './tasklist/HeaderTaskList';
import ButtonAddCard from './tasklist/ButtonAddCard';

function Board() {
  const state = useSelector((state: State) => state.tasks);
    
  return (
    <Container className='flex-1 flex flex-col overflow-y-auto'>
      <div className="board relative flex-1">
        <div className="board__wrapper relative">
          <div className="board__header sticky z-[20] top-0 left-0 flex">
            {!state.fetchTaskList.isError && state.data ? state.data.map((tasklist: TaskListType) => {
              return (
                <div key={'board__column-header' + tasklist.id} className='board__column-header shrink-0 w-[300px] flex flex-col gap-[15px] pr-[25px] bg-white pb-6'>
                  <HeaderTaskList tasklist={tasklist} count_tasks={tasklist.tasks?.length || 0} />
                  <ButtonAddCard />
                </div>
              )
            }) : null}
          </div>
          <div className="board__column-list flex pb-[188px]">
            {!state.fetchTaskList.isError && state.data ? state.data.map((tasklist: TaskListType) => {
              return (
                <TaskList key={tasklist.id} tasklist={tasklist} />
              )
            }) : null}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Board