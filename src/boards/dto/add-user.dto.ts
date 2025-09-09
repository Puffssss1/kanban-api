import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../enums';

export class AddUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(Role, { message: 'Role must be either VIEWER or Editor' })
  role: Role;
}
