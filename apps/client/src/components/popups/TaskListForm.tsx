import React, { useEffect, useState } from 'react';
import { TaskListFromProps, useTaskListForm } from '../../context/TaskListFormContext';
import DefaultPopup from './DefaultPopup';
import Button from '../Button';
import { store } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { fetchAddTaskList, fetchEditTaskList } from '../../redux/slice/tasks';

const TaskListForm: React.FC<TaskListFromProps> = () => {
  type AppDispatch = typeof store.dispatch;
  const dispatch = useDispatch<AppDispatch>();

  const { isOpen, closeForm, title, tasklist, isEditForm } = useTaskListForm();
  const [taskName, setTaskName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Set initial task name if provided
    if (tasklist) {
      setTaskName(tasklist.name || '');
    }
  }, [tasklist]);

  const handleSumbit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validation, dispatch, etc.

    event.preventDefault();
    // Validation
    if (taskName.trim() === '') {
      setError('Task name cannot be empty.');
      return;
    }
    if (taskName.length < 3 || taskName.length > 25) {
      setError('Task name must be between 3 and 25 characters.');
      return;
    }

    // Reset error if validation passes
    setError('');

    //dispatching
    if (!isEditForm) {
      // dispatching add new list
      dispatch(fetchAddTaskList(taskName)).then((data) => {
        if (data.payload.success) {
          setTaskName('');
          closeForm();
        }
      });
    } else {
      // dispatching edit list
      if (tasklist) {
        dispatch(fetchEditTaskList({ name: taskName, tasklistId: tasklist.id })).then((data) => {
          if (data.payload.success) {
            setTaskName('');
            closeForm();
          }
        });
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  };

  const handleClose = () => {
    setTaskName('');
    closeForm();
  }

  return (
    <DefaultPopup title={title} opened={isOpen} handleClose={handleClose}>
      <form className='flex flex-col w-[425px] gap-3 px-[35px] py-[20px] max-sm:max-w-[280px]' onSubmit={handleSumbit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="tasklist-name" className='font-medium text-[18px]'>Name</label>
          <input type="text" name="name" id='tasklist-name' value={taskName} onChange={handleChange} className='border-[1px] border-gray-500 rounded-[5px] text-[18px] px-[10px] py-2' />
          {error && <p className="text-red-500 max-w-full">{error}</p>}
        </div>
        <Button type='submit'>{!isEditForm ? 'Create' : 'Save'}</Button>
      </form>
    </DefaultPopup>
  );
};

export default TaskListForm;
