import React from 'react'
import { useSelector } from 'react-redux';
import { State } from '../../redux/store';
import { HistoryEntry } from '../../redux/features/history/types';
import DotText from './DotText';
import { formatDate } from '../../utils/format-date';
import { getTaskAttribute } from '../../utils/get-task-attribute';
import { Priority } from '../../redux/features/priorities/types';

const RenderTaskHistoryEntry: React.FunctionComponent<{ entry: HistoryEntry }> = ({ entry }) => {
  const statePriorities = useSelector((state: State) => state.priorities);
  const entryElement = getEntryElement(entry, statePriorities.priorities);
  const date = <span className='whitespace-nowrap'>{formatDate(entry.created_at, 'MONTH dd at hh:mm AMPM')}</span>

  return (
    <li key={entry.id} className="flex items-start">
      <span className='block size-1 bg-gray-500 rounded-full m-[10px]' />
      <div className="flex-1 flex items-start justify-between gap-4 max-[500px]:flex-col">
        {entryElement}
        {date}
      </div>
    </li>
  )
}

const getEntryElement = (entry: HistoryEntry, priorities: Priority[]) => {
  let entryElement = <></>;

  const handleDueDateChange = () => {
    const oldDueDate = entry.old_value !== 'null' ? formatDate(entry.old_value, 'DD, dd MONTH yyyy') : null;
    const newDueDate = entry.new_value !== 'null' ? formatDate(entry.new_value, 'DD, dd MONTH yyyy') : null;
    if (!oldDueDate) {
      entryElement = <span>You added due date {newDueDate}</span>
    } else if (!newDueDate) {
      entryElement = <span>You removed due date</span>
    } else {
      entryElement = <span>You changed due date from {oldDueDate} to {newDueDate}</span>
    }
  }

  const handlePriorityChange = () => {
    const oldPriority = getTaskAttribute(priorities, Number(entry.old_value), 'name');
    const newPriority = getTaskAttribute(priorities, Number(entry.new_value), 'name');
    if (!oldPriority) {
      entryElement = <span>You added priority {newPriority}</span>
    } else if (!newPriority) {
      entryElement = <span>You removed priority</span>
    } else {
      entryElement = <span>You changed priority from {oldPriority} to {newPriority}</span>
    }
  }

  if (entry.action === 'added' && !entry.field) {
    entryElement = <span>You created this task</span>
  } else if (entry.action === 'added' && entry.field === "description") {
    entryElement = <span>You added a description for this task</span>
  } else if (entry.action === 'changed' && entry.field === "description") {
    entryElement = <span>You chenged a description for this task</span>
  } else if (entry.action === 'changed' && entry.field === "due_date") {
    handleDueDateChange();
  } else if (entry.action === 'changed' && entry.field === "priority_id") {
    handlePriorityChange();
  } else if (entry.action === 'renamed') {
    entryElement = <span>You renamed this task from <DotText color='gray-500'>{entry.old_value}</DotText> to <DotText color='gray-500'>{entry.new_value}</DotText></span>
  } else if (entry.action === 'moved') {
    const oldTaskList = JSON.parse(entry.old_value).tasklist_name;
    const newTaskList = JSON.parse(entry.new_value).tasklist_name;
    entryElement = <span>You change status from <DotText color='gray-500'>{oldTaskList}</DotText> to <DotText color='gray-500'>{newTaskList}</DotText></span>
  }

  return entryElement;
}

export default RenderTaskHistoryEntry
