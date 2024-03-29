import React, { useEffect, useState } from 'react'
import { State, store } from '../../redux/store'
import { useDispatch, useSelector } from 'react-redux'

import { HistoryEntry } from '../../redux/features/history/types'

import { fetchHistory } from '../../redux/features/history/api'

import Button from '../Button'
import RenderHistoryEntry from './RenderHistoryEntry'
import { CloseIcon, ReloadIcon } from '../icons'

const History: React.FunctionComponent = () => {
  const [isOpenHistory, setisOpenHistory] = useState(false)
  type AppDispatch = typeof store.dispatch;
  const dispatch = useDispatch<AppDispatch>();
  const stateHistory = useSelector((state: State) => state.history); 

  useEffect(() => {
    if (isOpenHistory === true) {
      dispatch(fetchHistory());
    }
  }, [isOpenHistory])

  const handleCloseHistory = () => {
    setisOpenHistory(false);
  }
  const handleOpenHistory = () => {
    setisOpenHistory(true);
  }

  return (
    <div>
      <Button onClick={handleOpenHistory} icon={ReloadIcon} variant='border'>History</Button>
      <div className={`history-popup fixed z-50 inset-0 bg-black bg-opacity-25 ${isOpenHistory ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'} transition-all`}>
        <div className="history-popup__window absolute top-0 right-0 bg-white w-full max-w-[420px] h-screen flex flex-col">
          <div className="history-window__app-row w-full flex items-center justify-between p-[20px] bg-gray-500">
            <div className="history-window__app-title text-gray-50 text-[20px] select-none">
              History
            </div>
            <CloseIcon onClick={handleCloseHistory} className='text-gray-300 size-[33px] cursor-pointer hover:text-gray-50 active:scale-[0.9] transition-all' />
          </div>
          <div className="history-window__body p-[20px] flex-1 overflow-y-auto bg-gray-200">
            <ul className='flex flex-col text-gray-500 gap-[25px]'>
              {stateHistory.history.map((entry: HistoryEntry) => {
                return <RenderHistoryEntry key={entry.id} entry={entry} />
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default History