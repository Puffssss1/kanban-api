import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinDate,
} from 'class-validator';
// import { Priority } from '../enums';
import { Type } from 'class-transformer';
import { Priority } from '@prisma/client';

const today = new Date();
today.setHours(0, 0, 0, 0);

export class CreateTaskDto {
  @IsEmail()
  assignedTo: string;

  @Type(() => Date)
  @IsDate({ message: 'deadline must be a valid date (YYYY-MM-DD)' })
  @MinDate(today, { message: 'deadline must be in the future' })
  deadline: Date;

  @IsString()
  @IsNotEmpty()
  taskTitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Priority, {
    message: 'Priority must be either LOW, MEDIUM, HIGH or CRITICAL',
  })
  @IsNotEmpty()
  priority: Priority;
}
