import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from './entities/user.entity.js';

describe('UsersController', () => {
  let controller: UsersController;

  const usersService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  const user = { id: 1, email: 'marcos@example.com' } as User;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll repassa página e limite ao service', async () => {
    usersService.findAll.mockResolvedValue([user]);

    await expect(controller.findAll(2, 5)).resolves.toEqual([user]);
    expect(usersService.findAll).toHaveBeenCalledWith(2, 5);
  });

  it('findOne repassa o id ao service', async () => {
    usersService.findOne.mockResolvedValue(user);

    await expect(controller.findOne(1)).resolves.toBe(user);
    expect(usersService.findOne).toHaveBeenCalledWith(1);
  });

  it('create repassa o dto ao service', async () => {
    const dto: CreateUserDto = {
      email: user.email,
      name: 'Marcos',
      username: 'marcos',
    };
    usersService.create.mockResolvedValue(user);

    await expect(controller.create(dto)).resolves.toBe(user);
    expect(usersService.create).toHaveBeenCalledWith(dto);
  });

  it('update repassa id e dto ao service', async () => {
    const dto: UpdateUserDto = { name: 'Novo Nome' };
    usersService.update.mockResolvedValue(user);

    await expect(controller.update(1, dto)).resolves.toBe(user);
    expect(usersService.update).toHaveBeenCalledWith(1, dto);
  });

  it('remove repassa o id ao service', async () => {
    usersService.remove.mockResolvedValue(undefined);

    await expect(controller.remove(1)).resolves.toBeUndefined();
    expect(usersService.remove).toHaveBeenCalledWith(1);
  });
});