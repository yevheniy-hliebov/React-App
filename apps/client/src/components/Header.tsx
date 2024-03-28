import React from 'react'
import { useTaskListForm } from '../context/TaskListFormContext'
import Container from './Container'
import Button from './Button'
import { AddIcon, ReloadIcon } from './icons'

const Header: React.FunctionComponent = () => {
  const { openTaskListForm } = useTaskListForm();

  const handelClickCreateList = () => {
    openTaskListForm({ title: 'Create new list' });
  }

  return (
    <header className="header py-[18px]">
      <Container className='flex items-center justify-between gap-[10px] max-sm:flex-col'>
        <h1 className="header__title font-bold text-[35px]">My Task Board</h1>

        <div className="header__buttons flex items-center justify-between gap-[10px] max-[335px]:flex-col">
          <Button icon={ReloadIcon} variant='border'>History</Button>
          <Button icon={AddIcon} onClick={handelClickCreateList}>Create new list</Button>
        </div>
      </Container>
    </header>
  )
}

export default Header