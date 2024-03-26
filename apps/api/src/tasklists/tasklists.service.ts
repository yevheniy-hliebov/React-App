import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { Task, TaskList } from '@prisma/client';
import { EditTaskListDto } from './dto/edit-task-list.dto';
import { HistoriesService } from '../histories/histories.service';

@Injectable()
export class TaskListsService {
  constructor(
    private prisma: PrismaService,
    private historiesService: HistoriesService
  ) { }

  async create(createTaskListDto: CreateTaskListDto): Promise<TaskList> {
    const createdTaskList = await this.createTaskList(createTaskListDto);
    await this.createHistory(createdTaskList, 'added');
    return createdTaskList;
  }

  async getAll(): Promise<TaskList[]> {
    return this.prisma.taskList.findMany({
      orderBy: {
        created_at: 'asc'
      }
    });
  }

  async getAllWithTasks(): Promise<TaskList[]> {
    return this.prisma.taskList.findMany({
      include: {tasks: true},
      orderBy: {
        created_at: 'asc'
      }
    });
  }

  async edit(id: number, editTaskListDto: EditTaskListDto): Promise<TaskList> {
    const oldTaskList = await this.findById(id);
    const updatedTaskList = await this.editTaskList(id, editTaskListDto);
    await this.createHistory(oldTaskList, 'renamed', updatedTaskList);
    return updatedTaskList;
  }

  async delete(id: number, newTaskListId?: number): Promise<TaskList> {
    if (newTaskListId && isNaN(newTaskListId)) {
      throw new HttpException('Invalid new task list ID', HttpStatus.NOT_FOUND);
    }
    const taskListToDelete = await this.findById(id, true);
    await this.deleteOrMoveTasks(taskListToDelete, newTaskListId);
    const deletedTaskList = await this.deleteTaskList(id);
    await this.createHistory(taskListToDelete, 'deleted');
    return deletedTaskList;
  }

  private async createTaskList(createTaskListDto: CreateTaskListDto): Promise<TaskList> {
    try {
      const isTaskListExists = await this.isTaskListExists(createTaskListDto.name);
      if (isTaskListExists) {
        throw new HttpException('Task list with this name already exists', HttpStatus.CONFLICT);
      }
      const createdTaskList = await this.prisma.taskList.create({
        data: { name: createTaskListDto.name },
      });
      if (!createdTaskList) {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return createdTaskList;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async isTaskListExists(name: string): Promise<boolean> {
    const taskList = await this.prisma.taskList.findUnique({
      where: { name: name },
    });
    return taskList ? true : false
  }

  private async findById(id: number, includeTasks = false): Promise<TaskList & { tasks?: Task[] }> {
    const taskList = await this.prisma.taskList.findFirst({
      where: { id: id },
      include: { tasks: includeTasks }
    })
    if (!taskList) {
      throw new HttpException(`Task list with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return taskList;
  }

  private async editTaskList(id: number, editTaskListDto: EditTaskListDto): Promise<TaskList> {
    try {
      const updatedTaskList = await this.prisma.taskList.update({
        where: { id: id },
        data: editTaskListDto
      });
      return updatedTaskList;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async deleteOrMoveTasks(taskList: TaskList & { tasks?: Task[] }, newTaskListId?: number): Promise<void> {
    if (newTaskListId) {
      const newTaskList = await this.findById(newTaskListId);

      // Move tasks to the new task list
      await this.prisma.task.updateMany({
        where: { tasklist_id: taskList.id },
        data: { tasklist_id: newTaskListId },
      });

      for (const task of taskList.tasks) {
        await this.createTaskHistory(task, 'moved', taskList, newTaskList);
      }
    } else {
      // delete tasks
      await this.prisma.task.deleteMany({
        where: { tasklist_id: taskList.id }
      });

      for (const task of taskList.tasks) {
        await this.createTaskHistory(task, 'deleted', taskList);
      }
    }
  }

  private async deleteTaskList(id: number): Promise<TaskList> {
    try {
      const deletedTaskList = await this.prisma.taskList.delete({
        where: { id: id }
      });
      if (!deletedTaskList) {
        throw new HttpException('Task list not found', HttpStatus.NOT_FOUND);
      }
      return deletedTaskList;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async createHistory(oldTaskList: TaskList, action: string, updatedTaskList?: TaskList): Promise<void> {
    try {
      const entry: any = {
        action: action,
        model: 'TaskList',
        model_id: oldTaskList.id,
        data: JSON.stringify({
          name: oldTaskList['name']
        }),
      }
      if (action === 'renamed' && updatedTaskList) {
        entry.field = 'name';
        entry.old_value = oldTaskList['name'];
        entry.new_value = updatedTaskList['name'];
      }

      await this.historiesService.create(entry);
    } catch (error) {
      console.error(error);
    }
  }

  private async createTaskHistory(task: Task, action: string, oldTaskList: TaskList, newTaskList?: TaskList): Promise<void> {
    try {
      const entry: any = {
        action: action,
        model: 'Task',
        model_id: task.id,
        data: JSON.stringify({
          name: task.name,
          tasklist_name: oldTaskList.name,
        }),
      }
      if (action === 'moved' && newTaskList) {
        entry.field = 'name';
        entry.old_value = JSON.stringify({ tasklist_id: oldTaskList.id, tasklist_name: oldTaskList.name });
        entry.new_value = JSON.stringify({ tasklist_id: newTaskList.id, tasklist_name: newTaskList.name });
      }

      await this.historiesService.create(entry);
    } catch (error) {
      console.error(error);
    }
  }

  private handleError(error: unknown): HttpException {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}