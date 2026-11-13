import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from './entities/user.entity.js';

describe('UsersService', () => {
  let service: UsersService;

  // Os métodos encadeáveis devolvem o próprio objeto, como o ORM do Prisma.
  const userOrm = {
    orderBy: vi.fn(),
    limit: vi.fn(),
    offset: vi.fn(),
    where: vi.fn(),
    all: vi.fn(),
    first: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const prisma = { db: { orm: { public: { User: userOrm } } } };

  const user = {
    id: 1,
    email: 'marcos@example.com',
    name: 'Marcos',
    username: 'marcos',
    createdAt: '2026-11-12T12:00:00.000Z',
    updatedAt: '2026-11-12T12:00:00.000Z',
  } as User;

  beforeEach(async () => {
    vi.resetAllMocks();
    userOrm.orderBy.mockReturnValue(userOrm);
    userOrm.limit.mockReturnValue(userOrm);
    userOrm.offset.mockReturnValue(userOrm);
    userOrm.where.mockReturnValue(userOrm);

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('usa página 1 e limite 10 por padrão', async () => {
      userOrm.all.mockResolvedValue([user]);

      await expect(service.findAll()).resolves.toEqual([user]);
      expect(userOrm.orderBy).toHaveBeenCalledTimes(1);
      expect(userOrm.limit).toHaveBeenCalledWith(10);
      expect(userOrm.offset).toHaveBeenCalledWith(0);
    });

    it('calcula o offset a partir da página e do limite', async () => {
      userOrm.all.mockResolvedValue([]);

      await service.findAll(3, 5);

      expect(userOrm.limit).toHaveBeenCalledWith(5);
      expect(userOrm.offset).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('devolve o usuário encontrado', async () => {
      userOrm.first.mockResolvedValue(user);

      await expect(service.findOne(1)).resolves.toBe(user);
      expect(userOrm.first).toHaveBeenCalledWith({ id: 1 });
    });

    it('lança NotFoundException quando não existe', async () => {
      userOrm.first.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('cria o usuário com os dados recebidos', async () => {
      const dto: CreateUserDto = {
        email: user.email,
        name: 'Marcos',
        username: 'marcos',
      };
      userOrm.create.mockResolvedValue(user);

      await expect(service.create(dto)).resolves.toBe(user);
      expect(userOrm.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('atualiza o usuário pelo id', async () => {
      const dto: UpdateUserDto = { name: 'Novo Nome' };
      const updated = { ...user, name: 'Novo Nome' };
      userOrm.update.mockResolvedValue(updated);

      await expect(service.update(1, dto)).resolves.toBe(updated);
      expect(userOrm.where).toHaveBeenCalledWith({ id: 1 });
      expect(userOrm.update).toHaveBeenCalledWith(dto);
    });

    it('lança NotFoundException quando não existe', async () => {
      userOrm.update.mockResolvedValue(null);

      await expect(service.update(999, { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('remove o usuário pelo id', async () => {
      userOrm.delete.mockResolvedValue(user);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(userOrm.where).toHaveBeenCalledWith({ id: 1 });
    });

    it('lança NotFoundException quando não existe', async () => {
      userOrm.delete.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});