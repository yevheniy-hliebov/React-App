import React from 'react';
import { icons } from '../icons';
import { useTaskForm } from '../../context/TaskFormContext';

type ButtonAddCardProps = {
  tasklist_id: number;
}

const ButtonAddCard: React.FunctionComponent<ButtonAddCardProps> = ({ tasklist_id }) => {
  const { openTaskForm } = useTaskForm();

  const handleBtnAddCard = () => {
    openTaskForm({ tasklist_id });
  }

  const AddIcon = icons.add;
  return (
    <button onClick={handleBtnAddCard} className='w-full flex justify-center items-center gap-[10px] px-[15px] py-[10px] rounded-[10px] border-[1px] border-slate-300 border-dashed text-[20px] leading-6 hover:bg-gray-200 active:bg-gray-300 transition-all'>
      <AddIcon className='size-[28px]' />
      Add new card
    </button>
  )
}

export default ButtonAddCard