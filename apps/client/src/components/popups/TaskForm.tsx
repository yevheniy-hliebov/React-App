import React, { useEffect, useState } from 'react'
import { State, store } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useTaskForm } from '../../context/TaskFormContext';
import { Priority } from '../../redux/features/priorities/types';
import { createTask, updateTask } from '../../redux/features/tasks/api';

import DefaultPopup from './DefaultPopup';
import Button from '../Button';
import Dropdown, { DropdownOption } from '../Dropdown';
import { Loader } from '../icons';

import { isDate } from '../../utils/check-is-date';
import { getISODateString } from '../../utils/format-date';

type TaskState = {
  name: string;
  description: string | null;
  due_date: string | null;
}

const initialState = {
  name: '',
  description: null,
  due_date: null
}

const TaskCreateForm: React.FunctionComponent = () => {
  type AppDispatch = typeof store.dispatch;
  const dispatch = useDispatch<AppDispatch>();

  const statePriorities = useSelector((state: State) => state.priorities);

  const { isOpen, tasklist_id, task, isEditTaskForm, closeTaskForm } = useTaskForm();
  const [taskData, setTaskData] = useState<TaskState>(initialState);
  const [selectedPriority, setSelectedPriority] = useState<DropdownOption | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditTaskForm && task) {
      setTaskData({
        name: task.name,
        description: task.description,
        due_date: (task.due_date && isDate(task.due_date)) ? getISODateString(task.due_date) : null
      });
      if (task.priority_id) {
        const priority = statePriorities.priorities.find((priority: Priority) => priority.id === task.priority_id)
        if (priority) {
          setSelectedPriority({ label: priority.name, value: priority.id })
        }
      }
    } else if (tasklist_id) {
      setTaskData((prevTask: TaskState) => ({
        ...prevTask,
        tasklist_id: tasklist_id
      }));
    }
  }, [tasklist_id, task, isEditTaskForm]);

  let options = statePriorities.priorities.map((priority: Priority) => ({ label: priority.name, value: priority.id }));

  const handleSelect = (option: DropdownOption) => {
    setSelectedPriority(option);
    setError('');
  };


  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setTaskData((prevTask: TaskState) => ({
      ...prevTask,
      name: event.target.value
    }));
  }

  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setError('');
    event.target.style.height = '';
    event.target.style.height = event.target.scrollHeight + 2 + 'px';

    setTaskData((prevTask: TaskState) => ({
      ...prevTask,
      description: event.target.value
    }));
  }

  const handleDueDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setTaskData((prevTask: TaskState) => ({
      ...prevTask,
      due_date: event.target.value
    }));
  }

  const handleClose = () => {
    setError('');
    setTaskData(initialState);
    setSelectedPriority(null);
    closeTaskForm()
  }

  const validateTaskName = (taskName: string) => {
    if (taskName.trim() === '') {
      setError('Task name cannot be empty.');
      return false;
    }
    if (taskName.length < 3) {
      setError('Task name must contain at least 3 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleServerResponse = (data: any) => {
    if ('error' in data) {
      if (data.error.message === `Task not found`) {
        setError('Task not found, please refresh the page');
      } else {
        setError('Internal server error, please try another time');
      }
    } else {
      handleClose();
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

    if (!validateTaskName(taskData.name)) {
      return;
    }

    if (isEditTaskForm && task) {
      const data = {
        name: taskData.name,
        description: taskData.description === '' ? null : taskData.description,
        due_date: taskData.due_date ? new Date(taskData.due_date) : null,
        priority_id: selectedPriority ? Number(selectedPriority.value) : null,
        tasklist_id: task.tasklist_id
      }
      data.tasklist_id = task.tasklist_id;
      handleDispatch(dispatch(updateTask({ id: task.id, task: data })))
    } else if (tasklist_id) {
      const data = {
        name: taskData.name,
        description: taskData.description === '' ? null : taskData.description,
        due_date: taskData.due_date ? new Date(taskData.due_date) : null,
        priority_id: selectedPriority ? Number(selectedPriority.value) : null,
        tasklist_id: tasklist_id
      }
      handleDispatch(dispatch(createTask(data)));
    }
  }

  return (
    <DefaultPopup title={`${!isEditTaskForm ? 'Create' : 'Edit'} new task`} opened={isOpen} handleClose={handleClose} classNameBody='overflow-y-auto overflow-x-hidden'>
      <form className="task-form flex flex-col w-[425px] gap-3 px-[35px] py-[20px] max-sm:max-w-[280px]" onSubmit={handleSumbit}>
        <div className="flex flex-col">
          <label htmlFor="task-name" className='font-medium text-[18px]'>Name*</label>
          <input type="text" name="name" id='task-name' value={taskData.name || ''} onChange={handleChangeName} className='border-[1px] border-gray-500 rounded-[5px] text-[18px] px-[10px] py-2 focus:outline-gray-500' />
        </div>
        <div className="flex flex-col">
          <label htmlFor="task-description" className='font-medium text-[18px]'>Description</label>
          <textarea name="description" id='task-description' value={taskData.description || ''} onChange={handleDescription} className='border-[1px] border-gray-500 rounded-[5px] text-[18px] px-[10px] py-2 focus:outline-gray-500'>
          </textarea>
        </div>
        <div className="flex flex-col">
          <label htmlFor="task-due_date" className='font-medium text-[18px]'>Due date</label>
          <input type="date" name="due_date" id='task-due_date' value={taskData.due_date || ''} onChange={handleDueDate} className='border-[1px] border-gray-500 rounded-[5px] text-[18px] px-[10px] py-2 focus:outline-gray-500' />
        </div>
        <div className="flex flex-col relative z-[2]">
          <label className='font-medium text-[18px]'>Priority</label>
          <Dropdown
            className='bg-gray-50 border-gray-500'
            label={selectedPriority ? selectedPriority.label : 'Select new list'} options={options} onSelect={handleSelect} />
        </div>
        {error && <p className="text-red-500 max-w-full">{error}</p>}
        <Button type='submit' className={`${isLoading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
          <div className="relative z-0">
            {!isEditTaskForm ? 'Create' : 'Save'}
            <Loader className={`absolute top-1/2 left-full mx-1 -translate-y-1/2 size-6 fill-gray-50 m-0 ${isLoading ? 'opacity-1' : 'opacity-0'} transition-all`} />
          </div>
        </Button>
      </form>
    </DefaultPopup>
  )
}

export default TaskCreateForm