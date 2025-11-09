import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class AuthRegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  role: UserRole;
}