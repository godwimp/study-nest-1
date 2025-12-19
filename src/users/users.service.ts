import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './interfaces/user.interface';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    private users: User[] = [];

    create(createUserDto: CreateUserDto): User {
        const newUser: User = {
            id: uuidv4(),
            ...createUserDto,
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }

    findAll(): User[] {
        return this.users;
    }

    findOne(id: string): User {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    update(id: string, updateUserDto: UpdateUserDto): User {
        const userIndex = this.users.findIndex(user => user.id === id);

        if(userIndex === -1) {
            throw new Error('User not found');
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
            throw new Error('User not found, can not delete');
        }

        this.users.splice(userIndex, 1);
        return { message: 'User deleted' };
    }
}
