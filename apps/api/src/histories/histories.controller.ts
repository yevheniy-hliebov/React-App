import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { HistoriesService } from './histories.service';

@Controller("history")
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllHistory(@Query('text') text: string) {    
    if (text === 'true') {
      return this.historiesService.getAllHistoryText();
    }
    return this.historiesService.getAllHistory();
  }

  @Get('tasks/:id')
  @HttpCode(HttpStatus.OK)
  async getTaskHistory(@Param('id') id: number) {
    return this.historiesService.getTaskHistory(id);
  }
}
