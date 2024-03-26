import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TaskListsService } from './tasklists.service';
import { TaskListsController } from './tasklists.controller';
import { HistoriesService } from '../histories/histories.service';

@Module({
  imports: [],
  controllers: [TaskListsController],
  providers: [PrismaService, HistoriesService, TaskListsService],
})
export class TaskListsModule {}