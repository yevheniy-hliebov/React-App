import React, { useEffect } from 'react'
import { State, store } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';

import { HistoryEntry } from '../../redux/features/history/types';

import { fetchTasksHistory } from '../../redux/features/history/api';

import RenderTaskHistoryEntry from './RenderTaskHistoryEntry';

const TaskHistory: React.FunctionComponent<{ id: number }> = ({ id }) => {
  type AppDispatch = typeof store.dispatch;
  const dispatch = useDispatch<AppDispatch>();
  const stateTaskHistory = useSelector((state: State) => state.taskHistory);

  useEffect(() => {
    dispatch(fetchTasksHistory(id));
  }, [id])

  return (
    <div className="body-activity flex flex-col gap-[25px] flex-1 max-w-[545px] max-h-full overflow-y-auto bg-gray-200 px-[30px] py-[45px] max-lg:p-[25px] max-[960px]:max-w-full max-[960px]:max-h-none max-[960px]:overflow-y-visible">
      <div className="font-bold text-[24px]">Activity</div>
      <ul className='flex flex-col text-gray-500 gap-[15px]'>
        {stateTaskHistory.history.map((entry: HistoryEntry) => {
          return <RenderTaskHistoryEntry key={entry.id} entry={entry} />
        })}
      </ul>
    </div>
  )
}

export default TaskHistory