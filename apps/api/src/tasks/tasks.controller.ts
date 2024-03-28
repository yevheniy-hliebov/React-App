import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { Task } from '@prisma/client';

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<{ success: boolean, tasks: Task[]}> {
    return { success: true, tasks: await this.tasksService.getAll()};
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: number): Promise<{ success: boolean, task: Task}> {
    if (isNaN(id)) {
      throw new HttpException('Invalid id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, task: await this.tasksService.getById(Number(id))};
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto): Promise<{ success: boolean, task: Task}>  {
    return { success: true, task: await this.tasksService.create(createTaskDto)};
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async edit(@Param('id') id: number, @Body() editTaskDto: EditTaskDto): Promise<{ success: boolean, task: Task}> {
    if (isNaN(id)) {
      throw new HttpException('Invalid id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, task: await this.tasksService.edit(Number(id), editTaskDto)};
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number): Promise<{ success: boolean, task: Task}> {
    if (isNaN(id)) {
      throw new HttpException('Invalid id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, task: await this.tasksService.delete(Number(id))};
  }
}
