import TaskCard from './TaskCard'
import { TaskList as TaskListType } from '../../types/tasklist.type'
import { Task } from '../../types/task.type'

type TaskListProps = {
  tasklist: TaskListType;
  className?: string;
}

function TaskList({ tasklist, className = '' }: TaskListProps) {
  return (
    <div className={'tasklist shrink-0 w-[300px] ' + className}>
      <div key={'listcards' + tasklist.id} className="tasklist__list grid gap-[22px] pr-[25px]">
        {tasklist.tasks?.map((task: Task) => {
          return (
            <TaskCard key={task.id} task={task} />
          )
        })}
      </div>
    </div>
  )
}

export default TaskList