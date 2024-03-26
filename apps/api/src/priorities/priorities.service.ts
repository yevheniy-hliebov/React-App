import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Priority } from '@prisma/client';

@Injectable()
export class PrioritiesService {
  constructor(
    private prisma: PrismaService
  ) { }

  async getAll(): Promise<Priority[]> {
    try {
      return this.prisma.priority.findMany();
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}