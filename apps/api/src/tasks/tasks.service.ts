import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { TaskWithTaskList } from './task.type';
import { HistoriesService } from '../histories/histories.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private historiesService: HistoriesService,
  ) { }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = await this.createTask(createTaskDto);
    await this.createHistory(createdTask, 'added');
    return this.deleteFieldTaskList(createdTask);
  }

  async getAll(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      orderBy: {
        created_at: 'asc'
      }
    });
    return tasks;
  }

  async getById(id: number): Promise<Task> {
    const task = await this.findTaskById(id);
    return this.deleteFieldTaskList(task);
  }

  async edit(id: number, editTaskDto: EditTaskDto): Promise<Task> {
    const oldTask = await this.findTaskById(id, true);
    const updatedTask = await this.updateTask(id, editTaskDto, true);
    await this.createHistoryForEditedTask(editTaskDto, oldTask, updatedTask);
    return this.deleteFieldTaskList(updatedTask);
  }

  async delete(id: number): Promise<Task> {
    const deletedTask = await this.deleteTask(id, true);
    await this.createHistory(deletedTask, 'deleted');
    return this.deleteFieldTaskList(deletedTask);
  }

  private async findTaskById(id: number, includeTasklist = false): Promise<TaskWithTaskList> {
    try {
      const task = await this.prisma.task.findFirst({
        where: { id: id },
        include: { tasklist: includeTasklist }
      });
      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      return task;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async createTask(createTaskDto: CreateTaskDto): Promise<TaskWithTaskList> {
    try {
      return await this.prisma.task.create({
        data: createTaskDto,
        include: { tasklist: true }
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async updateTask(id: number, editTaskDto: EditTaskDto, includeTasklist = false): Promise<TaskWithTaskList> {
    try {
      return await this.prisma.task.update({
        where: { id: id },
        data: editTaskDto,
        include: { tasklist: includeTasklist }
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async deleteTask(id: number, includeTasklist = false): Promise<TaskWithTaskList> {
    try {
      return await this.prisma.task.delete({
        where: { id: id },
        include: { tasklist: includeTasklist }
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async createHistory(task: TaskWithTaskList, action: string): Promise<void> {
    try {
      await this.historiesService.create({
        action: action,
        model: 'Task',
        model_id: task.id,
        data: JSON.stringify({
          name: task['name'],
          tasklist_name: task.tasklist.name
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async createHistoryForEditedTask(editTaskDto: EditTaskDto, oldTask: TaskWithTaskList, updatedTask: TaskWithTaskList): Promise<void> {
    let nameRenamed = false;
    let taskMoved = false;
    for (const key in editTaskDto) {
      if (oldTask[key] !== updatedTask[key]) {
        let action = 'changed';
        let old_value = String(oldTask[key]), new_value = String(updatedTask[key]);
        if (key == 'name') {
          action = 'renamed';
        }
        if (key == 'description' && oldTask.description == null) {
          action = 'added'
        }
        if (key == 'tasklist_id') {
          action = 'moved';
          old_value = JSON.stringify({ tasklist_id: oldTask[key], tasklist_name: oldTask.tasklist.name });
          new_value = JSON.stringify({ tasklist_id: updatedTask[key], tasklist_name: updatedTask.tasklist.name });
        }

        if (key == 'due_date') {
          if (oldTask.due_date && updatedTask.due_date && oldTask.due_date.getTime() === updatedTask.due_date.getTime()) {
            continue;
          }
          if (!oldTask.due_date && !updatedTask.due_date) {
            continue;
          }
        }
        await this.historiesService.create({
          action: action,
          model: 'Task',
          model_id: oldTask.id,
          data: JSON.stringify({
            name: !nameRenamed ? oldTask['name'] : updatedTask['name'],
            tasklist_name: taskMoved ? oldTask.tasklist.name : updatedTask.tasklist.name
          }),
          field: key,
          old_value: old_value,
          new_value: new_value,
        });

        if (action == 'renamed') {
          nameRenamed = true;
        }
        if (action == 'moved') {
          taskMoved = true;
        }
      }
    }
  }

  private deleteFieldTaskList(task: TaskWithTaskList): Task {
    delete task.tasklist;
    return task;
  }

  private handleError(error: unknown): HttpException {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}