import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Priority } from '../enums';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  assignedTo: string;
  @IsDate()
  @IsNotEmpty()
  deadline: Date;
  @IsString()
  @IsNotEmpty()
  taskTitle: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsEnum(Priority, {
    message: 'Priority must be either LOW, MEDIUM, HIGH or CRITICAl',
  })
  @IsNotEmpty()
  priority: string;
}
