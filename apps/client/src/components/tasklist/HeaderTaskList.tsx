import { icons } from '../icons';
import ContextMenu, { ContextMenuOption } from '../ContextMenu';
import { TaskList } from '../../types/tasklist.type';
import { store } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { fetchDeleteTaskList } from '../../redux/slice/tasks';
import { useTaskListForm } from '../../context/TaskListFormContext';
import { useTaskListDeleteForm } from '../../context/TaskListDeleteFormContext';

type HeaderTaskListProps = {
  tasklist: TaskList;
  count_tasks?: number
};


function HeaderTaskList({ tasklist, count_tasks }: HeaderTaskListProps) {
  type AppDispatch = typeof store.dispatch;
  const dispatch = useDispatch<AppDispatch>();

  const { openTaskListForm } = useTaskListForm();
  const { openTaskListDeleteForm } = useTaskListDeleteForm();

  const EditIcon = icons.edit;
  const AddIcon = icons.add;
  const DeleteIcon = icons.delete;
  const OnSelectContextMenu = (option: ContextMenuOption) => {
    console.log('Selected option:', option);
    if (option.label === 'Edit') {
      openTaskListForm({ title: 'Rename list', tasklist: tasklist, isEditForm: true })
    } else if (option.label === 'Delete') {
      if (tasklist.tasks && tasklist.tasks.length > 0) {
        openTaskListDeleteForm(tasklist);
      } else {
        dispatch(fetchDeleteTaskList({ tasklistId: tasklist.id }))
      }
    }
  }

  const contextMenuOptions = [
    {
      label: 'Edit',
      icon: <EditIcon />
    },
    {
      label: 'Add new card',
      icon: <AddIcon />
    },
    {
      label: 'Delete',
      icon: <DeleteIcon />
    },
  ]


  return (
    <div className='tasklist__header-title h-[50px] border-y-[2px] border-y-gray-200 flex items-center justify-between leading-6'>
      <div className="text-[20px]">{tasklist.name}</div>
      <div className="flex items-center">
        <span className="text-[18px]">{count_tasks}</span>

        <ContextMenu options={contextMenuOptions} onSelect={OnSelectContextMenu} />
      </div>
    </div>
  )
}

export default HeaderTaskList