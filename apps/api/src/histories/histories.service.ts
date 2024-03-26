import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { History, Priority } from '@prisma/client';
import { MessageEntry } from './history.type';

@Injectable()
export class HistoriesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createHistoryDto: CreateHistoryDto): Promise<History> {
    try {
      return this.prisma.history.create({
        data: createHistoryDto,
      });
    } catch (error) {
      throw new HttpException('Failed to create history record', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllHistory(): Promise<History[]> {
    try {
      return this.prisma.history.findMany({
        orderBy: { created_at: 'desc', }
      });
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTaskHistory(id: number): Promise<History[]> {
    try {
      return this.prisma.history.findMany({
        where: { model: 'Task', model_id: id },
        orderBy: { created_at: 'desc', }
      });
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllHistoryText(): Promise<MessageEntry[]> {
    try {
      const history = await this.getAllHistory();
      const priorities = await this.prisma.priority.findMany();

      const messageLogs: MessageEntry[] = history.map((entry: History) => this.formatMessage(entry, priorities));
      return messageLogs;
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private formatMessage(entry: History, priorities: Priority[]) {
    const data = JSON.parse(entry.data);
    let message = "";

    if (entry.model == 'TaskList') {
      message = this.formatTaskListMessage(entry, data);
    } else {
      message = this.formatTaskMessage(entry, data, priorities);
    }

    return {
      id: entry.id,
      message: message,
      created_at: entry.created_at
    };
  }

  private formatTaskListMessage(entry: History, data: any) {
    if (entry.action === "added") {
      return `You added the task list "${data.name}"`;
    } else if (entry.action === "renamed") {
      return `You renamed the task list "${entry.old_value}" to "${entry.new_value}"`;
    } else if (entry.action === "deleted") {
      return `You deleted the task list "${data.name}"`;
    }
  }

  private formatTaskMessage(entry: History, data: any, priorities: Priority[]) {
    if (entry.action === "added" && entry.field == null) {
      return `You added "${data.name}" to ${data.tasklist_name}`;
    } else if (entry.action === "added" && entry.field == 'description') {
      return `You added the description to "${data.name}"`;
    } else if (entry.action === "renamed") {
      return `You renamed the ${entry.old_value} to "${entry.new_value}"`;
    } else if (entry.action === "changed") {
      return this.formatChangedTaskMessage(entry, data, priorities);
    } else if (entry.action === "moved") {
      return this.formatMovedTaskMessage(entry, data);
    } else if (entry.action === "deleted") {
      return `You deleted "${data.name}" from ${data.tasklist_name}`;
    }
  }

  formatChangedTaskMessage(entry: History, data: any, priorities: Priority[]) {
    if (entry.field == 'description'){
      return `You changed the description of "${data.name}"`;
    } else if (entry.field == 'priority_id') {
      const oldValuePriority = priorities.find((item: Priority) => item.id === Number(entry.old_value));
      const newValuePriority = priorities.find((item: Priority) => item.id === Number(entry.new_value));
      return `You changed the priority of "${data.name}" from ${oldValuePriority.name} to ${newValuePriority.name}`;
    } else if (entry.field == 'due_date') {
      return this.formatDueDateChangeMessage(data, entry);
    } else {
      return `You changed the ${entry.field} of "${data.name}" from ${entry.old_value} to ${entry.new_value}`;
    }
  }

  private formatDueDateChangeMessage(data: any, entry: History) {
    let oldDueDate: string = entry.old_value;
    let newDueDate: string = entry.new_value;
    if (entry.old_value !== 'null') {
      let date = new Date(entry.old_value);
      oldDueDate = this.foramtDate(date);
    }
    if (entry.new_value !== 'null') {
      let date = new Date(entry.new_value);
      newDueDate = this.foramtDate(date);
    }
    return `You changed the ${entry.field} of "${data.name}" from ${oldDueDate} to ${newDueDate}`;
  }

  private formatMovedTaskMessage(entry: History, data: any) {
    const oldValueJson: { tasklist_id: number, tasklist_name: string } = JSON.parse(entry.old_value);
    const newValueJson: { tasklist_id: number, tasklist_name: string } = JSON.parse(entry.new_value);
    return `You moved "${data.name}" from ${oldValueJson.tasklist_name} to ${newValueJson.tasklist_name}`;
  }


  private foramtDate(date: Date): string {
    return date.getFullYear() + '.' +
      (date.getMonth() + 1).toString().padStart(2, '0') + '.' +
      date.getDate().toString().padStart(2, '0') + ' ' +
      date.getHours().toString().padStart(2, '0') + ':' +
      date.getMinutes().toString().padStart(2, '0');
  }
}