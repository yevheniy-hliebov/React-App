import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HistoriesController } from './histories.controller';
import { HistoriesService } from './histories.service';

@Module({
  imports: [],
  controllers: [HistoriesController],
  providers: [PrismaService, HistoriesService],
})
export class HistoriesModule {}