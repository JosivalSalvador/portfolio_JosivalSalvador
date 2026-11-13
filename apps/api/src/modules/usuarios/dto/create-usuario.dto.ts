import { IsEmail, IsString, MinLength } from 'class-validator';
import type { Usuario } from '../entities/usuario.entity.js';

export class CreateUsuarioDto implements Pick<Usuario, 'email' | 'senhaHash'> {
  @IsEmail()
  email!: Usuario['email'];

  @IsString()
  @MinLength(8)
  senhaHash!: Usuario['senhaHash'];
}