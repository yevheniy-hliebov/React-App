import React, { useState } from 'react'
import DefaultPopup from './DefaultPopup'
import { TaskList } from '../../types/tasklist.type';
import Button from '../Button';
import Dropdown, { DropdownOption } from '../Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { State, store } from '../../redux/store';
import { icons } from '../icons';
import { fetchDeleteTaskList } from '../../redux/slice/tasks';
import { useTaskListDeleteForm } from '../../context/TaskListDeleteFormContext';

function TaskListDeleteForm() {
  const EastIcon = icons.east;

  type AppDispatch = typeof store.dispatch;
  const dispatch = useDispatch<AppDispatch>();

  const { isOpen, tasklist, closeForm } = useTaskListDeleteForm();
  const [error, setError] = useState('');
  const [isDeleteTasks, setIsDeleteTasks] = useState<boolean>(false);
  const [selectedTaskList, setSelectedTaskList] = useState<DropdownOption | null>(null);
  const stateTaskList = useSelector((state: State) => state.tasks);

  let options = (!stateTaskList.fetchTaskList.isError && stateTaskList.data) ? stateTaskList.data
    .filter((new_tasklist: TaskList) => tasklist?.id !== new_tasklist.id)
    .map((tasklist: TaskList) => ({ label: tasklist.name, value: tasklist.id }))
    : [];


  const handleSelect = (option: DropdownOption) => {
    console.log('Selected option:', option);
    setSelectedTaskList(option);
    setError('');
  };

  const handleSumbit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    let moveTasksToId: number | undefined = undefined;
    if (!isDeleteTasks && selectedTaskList) {
      moveTasksToId = Number(selectedTaskList.value);
    }
    if (!isDeleteTasks && !selectedTaskList) {
      setError('Select the list where to move or delete all tasks in the list')
    } else {
      if (tasklist) {
        dispatch(fetchDeleteTaskList({tasklistId: tasklist.id, moveTasksToId: moveTasksToId}))
      }
    }
  }

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDeleteTasks(event.target.checked);
    setError('');
  }
  
  const handleCancel = () => {
    setSelectedTaskList(null);
    setIsDeleteTasks(false);
    setError('');
    closeForm();
  }

  return (
    <DefaultPopup title='Delete or Move tasks' opened={isOpen} handleClose={handleCancel} > 
      <form className='flex flex-col -max-w-[700px] gap-3 px-[35px] py-[20px] max-sm:max-w-[280px]' onSubmit={handleSumbit}>
        <div className="flex items-center mb-4">
          <input onChange={handleChangeCheckbox} type="checkbox" checked={isDeleteTasks} className="size-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label className="ms-2 text-[14px] font-medium text-gray-900">Delete all tasks in the <span className='line-through'>{tasklist?.name}</span> list without moving them to another list</label>
        </div>
        <div className={`grid items-center ${isDeleteTasks ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="text-[14px] mb-3">Or select a new list for moving task there</div>
          <div className="delete__grid grid">
            <div className='text-[12px]'>This list will be deleted:</div>
            <div></div>
            <div className='text-[12px]'>Move existing tasks to:</div>
          </div>
          <div className="delete__grid grid items-center">
            <div className='font-medium text-[16px] min-w-[70px] line-through p-2 bg-slate-100 rounded-md text-slate-500'>{tasklist?.name}</div>
            <EastIcon className='justify-self-end mr-[20px]' />
            <Dropdown label={selectedTaskList ? selectedTaskList.label : 'Select new list'} options={options} onSelect={handleSelect} />
          </div>
        </div>
        {error && <p className="text-red-500 max-w-full">{error}</p>}
        <div className="flex flex-1 items-end gap-3 justify-center w-full ">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type='submit' className='bg-red-500 hover:bg-red-600 active:bg-red-700'>Delete</Button>
        </div>
      </form>
    </DefaultPopup>
  )
}

export default TaskListDeleteForm