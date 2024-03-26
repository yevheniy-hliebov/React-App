import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrioritiesController } from './priorities.controller';
import { PrioritiesService } from './priorities.service';

@Module({
  imports: [],
  controllers: [PrioritiesController],
  providers: [PrismaService, PrioritiesService],
})
export class PrioritiesModule {}