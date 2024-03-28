import { State } from '../../redux/store';
import { useSelector } from 'react-redux';

import { useTaskForm } from '../../context/TaskFormContext';
import { useTaskPopup } from '../../context/TaskPopupContext';

import DefaultPopup from './DefaultPopup'
import Button from '../Button';

import { CalendarIcon, CycleIcon, EditIcon, SellIcon } from '../icons';
import { formatDate } from '../../utils/format-date';
import { Task } from '../../redux/features/tasks/types';

const TaskPopup = () => {
  const { isOpen, task, closeTaskPopup } = useTaskPopup();
  const { openTaskForm } = useTaskForm();

  const stateTasklists = useSelector((state: State) => state.tasklists);
  const statePriorities = useSelector((state: State) => state.priorities);
  const status = getTaskAttribute(stateTasklists.taskLists, task?.tasklist_id, 'name');
  const priority = getTaskAttribute(statePriorities.priorities, task?.priority_id, 'name');

  const handleClickEdit = () => {
    openTaskForm({ task, isEditTaskForm: true })
    closeTaskPopup();
  }

  return (
    <DefaultPopup opened={isOpen} handleClose={closeTaskPopup} classNameBody='flex max-h-full overflow-hidden' classNameWindow='w-full'>
      <div className="body-info max-h-full overflow-y-auto flex-1 flex flex-col gap-[50px] p-[45px]">
        {renderTaskInfo(task, handleClickEdit, status, priority)}
      </div>
      <div className="body-activity flex-1 max-w-[545px] max-h-full overflow-y-auto bg-gray-100">
        <div className="">
          Activity
        </div>
      </div>
    </DefaultPopup>
  )
}

const getTaskAttribute = (array: any[], id: number | null | undefined, attribute: string) => {
  return (array.find(item => item.id === id))?.[attribute];
}

const renderTaskInfo = (task: Task | undefined, handleClickEdit: () => void, status: string | undefined, priority: string | undefined) => {
  if (!task) return null;

  return (
    <>
      <div className="body-info__params flex flex-col gap-[25px]">
        {renderTaskHeader(task, handleClickEdit)}
        {renderTaskParams(task, status, priority)}
      </div>
      {renderTaskDescription(task)}
    </>
  );
}

const renderTaskHeader = (task: Task, handleClickEdit: () => void) => {
  return (
    <div className="body-info__title-row flex justify-between items-center gap-[25px]">
      <div className="body-info__title font-bold text-[32px]">{task.name}</div>
      <Button onClick={handleClickEdit} icon={EditIcon} variant='border' classNameIcon='text-gray-400'>
        Edit task
      </Button>
    </div>
  );
}

const renderTaskParams = (task: Task, status: string | undefined, priority: string | undefined) => {
  return (
    <div className="body-info__params-rows text-[20px]">
      {renderTaskParam('Status', status, CycleIcon)}
      {renderTaskParam('Due date', task.due_date ? formatDate(task.due_date, 'DD, dd MONTH') : undefined, CalendarIcon)}
      {renderTaskParam('Priority', task.priority_id ? priority : undefined, SellIcon)}
    </div>
  );
}

const renderTaskParam = (name: string, value: string | undefined, Icon: any) => {
  return (
    <div className="body-info__params-row flex items-center gap-[10px]">
      <div className="body-info__params-field text-gray-400 flex gap-[10px] items-center p-[5px] max-w-[212px] flex-1">
        <Icon />
        {name}
      </div>
      <div className="body-info__params-value p-[5px] font-medium">
        {value ? value :
          <span className='italic text-gray-300'>not assigned</span>
        }
      </div>
    </div>
  );
}

const renderTaskDescription = (task: Task) => {
  if (!task.description) return null;

  return (
    <div className="body-info__desc flex flex-col gap-[15px]">
      <div className="body-info__desc-title font-bold text-[25px]">Description</div>
      <div className="body-info__desc-text font-medium text-[18px] text-gray-500">{task.description}</div>
    </div>
  );
}

export default TaskPopup
