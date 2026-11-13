// dto/create-user.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { User } from '../entities/user.entity';

export class CreateUserDto implements Pick<User, 'email' | 'name' | 'username'> {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(3)
  username: string;
}