import { Injectable } from '@nestjs/common';
import { CreatePerfilDto } from './dto/create-perfil.dto.js';
import { UpdatePerfilDto } from './dto/update-perfil.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class PerfilService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPerfilDto: CreatePerfilDto) {
    return 'This action adds a new perfil';
  }

  findAll() {
    return `This action returns all perfil`;
  }

  findOne(id: number) {
    return `This action returns a #${id} perfil`;
  }

  update(id: number, updatePerfilDto: UpdatePerfilDto) {
    return `This action updates a #${id} perfil`;
  }

  remove(id: number) {
    return `This action removes a #${id} perfil`;
  }
}
