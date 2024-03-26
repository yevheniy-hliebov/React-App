import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PrioritiesService } from './priorities.service';
import { Priority } from '@prisma/client';

@Controller("priorities")
export class PrioritiesController {
  constructor(private readonly prioritiesService: PrioritiesService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<{ success: boolean, priorities: Priority[]}> {
    return { success: true, priorities: await this.prioritiesService.getAll() };
  }
}
