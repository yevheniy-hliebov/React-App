import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { HistoriesService } from '../histories/histories.service';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [PrismaService, HistoriesService, TasksService],
})
export class TasksModule {}