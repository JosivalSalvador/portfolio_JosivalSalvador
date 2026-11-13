import { PartialType } from '@nestjs/swagger';
import { CreatePerfilDto } from './create-perfil.dto.js';

export class UpdatePerfilDto extends PartialType(CreatePerfilDto) {}
