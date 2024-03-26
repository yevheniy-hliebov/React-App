import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateTaskListDto {
  @MinLength(3)
  @MaxLength(25)
  @IsNotEmpty()
  name: string;
}