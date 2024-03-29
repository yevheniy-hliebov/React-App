import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { History } from '@prisma/client';
import { MessageEntry } from './history.type';

@Controller("history")
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllHistory(@Query('text') text: string): Promise<{ success: boolean, history: History[] | MessageEntry[] }> {
    if (text === 'true') {
      return { success: true, history: await this.historiesService.getAllHistoryText() };
    }
    return { success: true, history: await this.historiesService.getAllHistory() };
  }

  @Get('tasks/:id')
  @HttpCode(HttpStatus.OK)
  async getTaskHistory(@Param('id') id: number): Promise<{ success: boolean, task_history: History[] }> {
    if (isNaN(id)) {
      throw new HttpException('Invalid id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, task_history: await this.historiesService.getTaskHistory(Number(id)) };
  }
}
