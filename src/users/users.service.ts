import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from './interfaces/user.interface';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { NestFactory } from '@nestjs/core';

@Injectable()
export class UsersService {
    private users: User[] = [];

    create(createUserDto: CreateUserDto): User {
        const newUser: User = {
            id: randomUUID(),
            ...createUserDto,
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }

    search(keyword: string): User[] {
        return this.users.filter(user =>
            user.name.toLowerCase().includes(keyword.toLowerCase()) ||
            user.email.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    findAll(): User[] {
        return this.users;
    }

    findOne(id: string): User {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }
        return user;
    }

    update(id: string, updateUserDto: UpdateUserDto): User {
        const userIndex = this.users.findIndex(user => user.id === id);

        if(userIndex === -1) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updateUserDto,
        };

        return this.users[userIndex];;
    }

    remove(id: string): { message: string } {
        const userIndex = this.users.findIndex(user => user.id === id);

        if (userIndex === -1) {
            throw new NotFoundException(`User ${id} not found`);
        }

        this.users.splice(userIndex, 1);
        return { message: 'User deleted' };
    }

    findAllPaginated(page: number = 1, limit: number = 10) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {
            total: this.users.length,
            page,
            limit,
            data: this.users.slice(startIndex, endIndex),
        };

        return results;
    }

   

    findByName(name: string): User[] {
        const users = this.users.filter(user =>
            user.name.toLowerCase().includes(name.toLowerCase())
        );

        if (users.length === 0) {
            throw new NotFoundException(`User with name ${name} can not be found`);
        }
        return users;
    }
    filterByAge(minAge: number, maxAge: number): User[] {
        return this.users.filter(user =>
            user.age >= minAge && user.age <= maxAge
        );
    }
}
