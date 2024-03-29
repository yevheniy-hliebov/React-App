import React from 'react'
import { useSelector } from 'react-redux';
import { State } from '../../redux/store';

import { HistoryEntry } from '../../redux/features/history/types';
import { Priority } from '../../redux/features/priorities/types';

import DotText from './DotText';

import { formatDate } from '../../utils/format-date';
import { getTaskAttribute } from '../../utils/get-task-attribute';

const RenderHistoryEntry: React.FunctionComponent<{ entry: HistoryEntry }> = ({ entry }) => {
  const statePriorities = useSelector((state: State) => state.priorities);
  const entryElement = getEntryElement(entry, statePriorities.priorities);
  const date = <span className='whitespace-nowrap italic'>{formatDate(entry.created_at, 'MONTH dd at hh:mm AMPM')}</span>

  return (
    <li key={entry.id} className="flex items-start">
      <span className='block size-1 bg-gray-500 rounded-full m-[10px]' />
      <div className="flex-1 flex items-start justify-between gap-2 flex-col">
        {entryElement}
        {date}
      </div>
    </li>
  )
}

const getEntryElement = (entry: HistoryEntry, priorities: Priority[]) => {
  let entryElement = <></>;

  const getTaskName = (data: string): string => (JSON.parse(data))?.name;
  const getListName = (data: string): string => (JSON.parse(data))?.name;

  const handleTaskAction = (action: string, field: string) => {
    const taskName = getTaskName(entry.data);
    if (action === 'added' && !field) {
      const data = JSON.parse(entry.data);
      entryElement = <span>You added <DotText isBold={true}>{taskName}</DotText> to <span className='font-medium'>{data.tasklist_name}</span></span>
    } else if (action === 'added' && field === "description") {
      entryElement = <span>You added a description for <DotText isBold={true}>{taskName}</DotText></span>
    } else if (action === 'changed' && field === "description") {
      entryElement = <span>You changed a description in <DotText isBold={true}>{taskName}</DotText></span>
    } else if (action === 'changed' && field === "due_date") {
      entryElement = handleDueDateChange(taskName);
    } else if (action === 'changed' && field === "priority_id") {
      entryElement = handlePriorityChange(taskName, priorities);
    } else if (action === 'renamed') {
      entryElement = <span>You renamed task from <DotText isBold={true}>{entry.old_value}</DotText> to <DotText isBold={true}>{entry.new_value}</DotText></span>
    } else if (action === 'moved') {
      const data = JSON.parse(entry.data);
      const oldTaskList = JSON.parse(entry.old_value).tasklist_name;
      const newTaskList = JSON.parse(entry.new_value).tasklist_name;
      entryElement = <span>You moved <DotText isBold={true}>{data.name}</DotText> from <span className='font-medium'>{oldTaskList}</span> to <span className='font-medium'>{newTaskList}</span></span>
    } else if (action === 'deleted' && !field) {
      entryElement = <span>You deleted <DotText isBold={true}>{taskName}</DotText> task</span>
    }
  }

  const handleListAction = (action: string, field: string) => {
    if (action === 'added' && !field) {
      const listName = getListName(entry.data);
      entryElement = <span>You added new <DotText isBold={true}>{listName}</DotText> list</span>
    } else if (action === 'deleted' && !field) {
      const listName = getListName(entry.data);
      entryElement = <span>You deleted <DotText isBold={true}>{listName}</DotText> list</span>
    } else if (action === 'renamed') {
      entryElement = <span>You renamed list from <DotText isBold={true}>{entry.old_value}</DotText> to <DotText isBold={true}>{entry.new_value}</DotText></span>
    }
  }

  const handleDueDateChange = (taskName: string) => {
    const oldDueDate = entry.old_value !== 'null' ? formatDate(entry.old_value, 'DD, dd MONTH yyyy') : null;
    const newDueDate = entry.new_value !== 'null' ? formatDate(entry.new_value, 'DD, dd MONTH yyyy') : null;
    if (!oldDueDate) {
      return <span>You added due date {newDueDate} for <DotText isBold={true}>{taskName}</DotText></span>
    } else if (!newDueDate) {
      return <span>You removed due date from <DotText isBold={true}>{taskName}</DotText></span>
    } else {
      return <span>You changed due date from {oldDueDate} to {newDueDate} in <DotText isBold={true}>{taskName}</DotText></span>
    }
  }

  const handlePriorityChange = (taskName: string, priorities: Priority[]) => {
    const oldPriority = getTaskAttribute(priorities, Number(entry.old_value), 'name');
    const newPriority = getTaskAttribute(priorities, Number(entry.new_value), 'name');
    if (!oldPriority) {
      return <span>You added priority {newPriority} for <DotText isBold={true}>{taskName}</DotText></span>
    } else if (!newPriority) {
      return <span>You removed priority from <DotText isBold={true}>{taskName}</DotText></span>
    } else {
      return <span>You changed priority from {oldPriority} to {newPriority} in <DotText isBold={true}>{taskName}</DotText></span>
    }
  }

  if (entry.model === 'TaskList') {
    handleListAction(entry.action, entry.field);
  } else if (entry.model === 'Task') {
    handleTaskAction(entry.action, entry.field);
  }

  return entryElement;
}

export default RenderHistoryEntry
