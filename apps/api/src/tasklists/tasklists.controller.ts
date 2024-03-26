import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { TaskListsService } from './tasklists.service';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { EditTaskListDto } from './dto/edit-task-list.dto';
import { TaskList } from '@prisma/client';

@Controller("tasklists")
export class TaskListsController {
  constructor(private readonly taskListsService: TaskListsService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Query('includeTasks') includeTasks: string): Promise<{success: boolean, tasklists: TaskList[]}> {    
    if (includeTasks === 'true') {
      return {success: true, tasklists: await this.taskListsService.getAllWithTasks()};
    }
    return {success: true, tasklists: await this.taskListsService.getAll()};
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskListDto: CreateTaskListDto): Promise<{success: boolean, tasklist: TaskList}> {
    return {success: true, tasklist: await this.taskListsService.create(createTaskListDto)};
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async edit(@Param('id') id: number, @Body() editTaskListDto: EditTaskListDto): Promise<{success: boolean, tasklist: TaskList}> {
    if (isNaN(id)) {
      throw new HttpException('Invalid id provided', HttpStatus.BAD_REQUEST);
    }
    return {success: true, tasklist: await this.taskListsService.edit(Number(id), editTaskListDto)};
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number, @Query('movetoid') movetoid: number): Promise<{success: boolean, tasklist: TaskList}> {
    if (isNaN(id)) {
      throw new HttpException('Invalid id provided', HttpStatus.BAD_REQUEST);
    }
    return {success: true, tasklist: await this.taskListsService.delete(Number(id), movetoid)};
  }
}
