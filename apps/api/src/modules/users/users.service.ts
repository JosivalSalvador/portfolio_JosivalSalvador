import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    private users: User[] = [];

    findAll(){
        return {
            message: 'This action returns all users',
            users: this.users
        }
    }

    getUsers(page: number, limit: number){
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = this.users.slice(startIndex, endIndex);
        return {
            message: `This action returns users for page ${page} with limit ${limit}`,
            users: paginatedUsers
        }
    }

    getUserById(id: number){
        return {
            message: `This action returns user with id ${id}`,
            user: this.users.find(user => user.id === id) || null
        }
    }

    createUser(createUserDto: CreateUserDto){
        const newUser = {
            id: this.users.length + 1,
            name: createUserDto.name,
            email: createUserDto.email
        };
        this.users.push(newUser);
        return {
            message: 'This action creates a new user',
            user: createUserDto
        }
    }

    updateUser(id: number, updateUserDto: UpdateUserDto){
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
        }
        return {
            message: `This action updates user with id ${id}`,
            user: updateUserDto
        }
    }

    deleteUser(id: number){
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
        }
        return {
            message: `This action deletes user with id ${id}`
        }
    }
}
