import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class EditTaskListDto {
  @MinLength(3)
  @MaxLength(25)
  @IsNotEmpty()
  name: string;
}