import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../enums';

export class UpdateBoardDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(Role, { message: 'Role is only either VIEWER or EDITOR' })
  role: Role;

  @IsNotEmpty()
  @IsString()
  email: string;
}
