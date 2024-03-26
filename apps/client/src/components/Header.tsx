import React from 'react'
import Button from './Button'
import { icons } from './icons'
import Container from './Container'
import { useTaskListForm } from '../context/TaskListFormContext'

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
          <Button icon={icons.reload} variant='border'>History</Button>
          <Button icon={icons.add} onClick={handelClickCreateList}>Create new list</Button>
        </div>
      </Container>
    </header>
  )
}

export default Header