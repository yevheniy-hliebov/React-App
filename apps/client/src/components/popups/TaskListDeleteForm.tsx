import React, { useState } from 'react'
import { State, store } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTaskList } from '../../redux/features/taskLists/api';
import { useTaskListDeleteForm } from '../../context/TaskListDeleteFormContext';

import { TaskList } from '../../redux/features/taskLists/types';

import DefaultPopup from './DefaultPopup'
import Button from '../Button';
import Dropdown, { DropdownOption } from '../Dropdown';
import { EastIcon, Loader } from '../icons';

function TaskListDeleteForm() {
  type AppDispatch = typeof store.dispatch;
  const dispatch = useDispatch<AppDispatch>();

  const { isOpen, tasklist, closeForm } = useTaskListDeleteForm();
  const [error, setError] = useState('');
  const [isDeleteTasks, setIsDeleteTasks] = useState<boolean>(false);
  const [selectedTaskList, setSelectedTaskList] = useState<DropdownOption | null>(null);
  const stateTaskLists = useSelector((state: State) => state.tasklists);
  const [isLoading, setIsLoading] = useState(false);

  let options = stateTaskLists.taskLists
    .filter((new_tasklist: TaskList) => tasklist?.id !== new_tasklist.id)
    .map((tasklist: TaskList) => ({ label: tasklist.name, value: tasklist.id }));


  const handleSelect = (option: DropdownOption) => {
    console.log('Selected option:', option);
    setSelectedTaskList(option);
    setError('');
  };

  const handleServerResponse = (data: any) => {
    if ('error' in data) {
      if (data.error.message === `Task list with id ${tasklist?.id} not found`) {
        setError('Task list not found, please refresh the page');
      } else if (data.error.message === `Task list with id ${selectedTaskList?.value} not found`) {
        setError('New task list not found, please refresh the page');
      } else if (data.error.message === 'Task list with this name already exists') {
        setError(data.error.message);
      } else {
        setError('Internal server error, please try another time');
      }
    } else {
      handleCancel();
    }
  };

  const handleDispatch = (dispatchFunction: any) => {
    setIsLoading(true);
    dispatchFunction
      .then((data: any) => {
        handleServerResponse(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
    } else if (tasklist) {
      handleDispatch(dispatch(deleteTaskList({ id: tasklist.id, moveTasksToId: moveTasksToId })));
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
          <input onChange={handleChangeCheckbox} type="checkbox" checked={isDeleteTasks} className="size-5 text-gray-600 bg-gray-100 border-gray-300 rounded focus:outline-gray-500 focus:ring-2" />
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
        <div className="flex flex-1 items-end gap-3 justify-center w-full">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type='submit' className={`bg-red-500 hover:bg-red-600 active:bg-red-700 ${isLoading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
            <div className="relative">
              Delete
              <Loader className={`absolute top-1/2 left-full mx-1 -translate-y-1/2 size-6 fill-gray-50 m-0 ${isLoading ? 'opacity-1' : 'opacity-0'} transition-all`} />
            </div>
          </Button>
        </div>
      </form>
    </DefaultPopup>
  )
}

export default TaskListDeleteForm