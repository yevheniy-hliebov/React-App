import { IsDateString, IsNotEmpty, IsNumber, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()  
  @MinLength(3)  
  name: string;

  @IsOptional()
  description?: string;
  
  @IsOptional()
  @IsDateString()
  due_date?: Date;

  @IsOptional()
  @IsNumber()
  priority_id?: number;
  
  @IsNumber()
  tasklist_id: number;
}