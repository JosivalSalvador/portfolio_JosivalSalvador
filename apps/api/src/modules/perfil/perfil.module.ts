import { Module } from '@nestjs/common';
import { PerfilService } from './perfil.service.js';
import { PerfilController } from './perfil.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PerfilController],
  providers: [PerfilService],
})
export class PerfilModule {}
