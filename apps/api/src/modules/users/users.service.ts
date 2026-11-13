import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from './entities/user.entity.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10): Promise<User[]> {
    return this.prisma.db.orm.public.User
      .orderBy((u) => u.createdAt.asc())
      .limit(limit)
      .offset((page - 1) * limit)
      .all();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.db.orm.public.User.first({ id });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.db.orm.public.User.create(createUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.db.orm.public.User
      .where({ id })
      .update(updateUserDto);

    if (!user) throw new NotFoundException(`User ${id} not found`);

    return user;
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.prisma.db.orm.public.User.where({ id }).delete();

    if (!deleted) throw new NotFoundException(`User ${id} not found`);
  }
}