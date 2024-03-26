import { icons } from '../icons'
import Dropdown, { DropdownOption } from '../Dropdown';
import ContextMenu, { ContextMenuOption } from '../ContextMenu';
import { Task } from '../../types/task.type';
import { formatDate } from '../../utils/format-date';
import { Priority } from '../../types/priority.type';
import { useDispatch, useSelector } from 'react-redux';
import { State, store } from '../../redux/store';
import { TaskList } from '../../types/tasklist.type';
import { fetchMoveTask } from '../../redux/slice/tasks';

type TaskCardProps = {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  type AppDispatch = typeof store.dispatch;
  const dispatch = useDispatch<AppDispatch>();
  const statePriorities = useSelector((state: State) => state.priorities);
  const stateTaskList = useSelector((state: State) => state.tasks);
  const CalendarIcon = icons.calendar;
  let priority = (!statePriorities.isError && statePriorities.data) ? statePriorities.data.find((priority: Priority) => task.priority_id === priority.id) : null;

  let options = (!stateTaskList.fetchTaskList.isError && stateTaskList.data) ? stateTaskList.data
    .filter((tasklist: TaskList) => task.tasklist_id !== tasklist.id)
    .map((tasklist: TaskList) => ({ label: tasklist.name, value: tasklist.id }))
    : [];


  const handleSelect = (option: DropdownOption) => {
    console.log('Selected option:', option);
    dispatch(fetchMoveTask({ taskId: task.id, oldTaskListId: task.tasklist_id, tasklistId: Number(option.value) }))
  };

  const EditIcon = icons.edit;
  const DeleteIcon = icons.delete;
  const OnSelectContextMenu = (option: ContextMenuOption) => {
    console.log('Selected option:', option);
  }

  const contextMenuOptions = [
    {
      label: 'Edit',
      icon: <EditIcon />
    },
    {
      label: 'Delete',
      icon: <DeleteIcon />
    },
  ]

  return (
    <div className='bg-white flex flex-col gap-[16px] items-start border-[1px] px-[15px] py-[20px] rounded-[10px] border-slate-300 shadow-[2px_2px_4px_rgba(0,0,0,0.1)]'>
      <div className="flex w-full justify-between">
        <div className="text-left leading-6 flex flex-col gap-[8px]">
          <div className="text-[20px]">{task.name}</div>
          <div className="font-medium tracking-wide text-[14px] text-gray-500 leading-7">
            {task.description}
          </div>
        </div>
        <div className="shrink-0 top-[20px] right-[16px] options flex">
          <ContextMenu options={contextMenuOptions} onSelect={OnSelectContextMenu} />
        </div>
      </div>
      {task.due_date ? (
        <div className="flex items-center gap-[8px]">
          <CalendarIcon className='size-[27px]' />
          <span className='font-medium text-[16px] leading-6 text-gray-500'>
            {formatDate(task.due_date, 'DD, dd MONTH')}
          </span>
        </div>
      ) : null}
      {priority ? (
        <div className="inline-flex items-center gap-[8px] px-[12px] py-[5px] rounded-[20px] bg-gray-100">
          <span className='size-[10px] bg-slate-400 rounded-md'></span>
          <span className='text-[16px] leading-6 text-gray-500'>
            {priority.name}
          </span>
        </div>
      ) : null}
      {options.length > 0 ? <Dropdown label="Move to:" options={options} onSelect={handleSelect} /> : null}
    </div>
  )
}

export default TaskCard