import { IsDateString, IsNotEmpty, IsNumber, IsOptional, MinLength } from 'class-validator';

export class EditTaskDto {
  @IsOptional()
  @IsNotEmpty()  
  @MinLength(3)  
  name?: string;

  @IsOptional()
  description?: string;
  
  @IsOptional()
  @IsDateString()
  due_date?: Date;

  @IsOptional()
  @IsNumber()
  priority_id?: number;
  
  @IsOptional()
  @IsNumber()
  tasklist_id?: number;
}