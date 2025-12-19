import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from 'generated/prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        return this.prisma.user.create({
            data: createUserDto,
        });
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({
            include: {
                products: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findByName(name: string): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
            include: {
                products: true,
            },
        });

        if (users.length === 0) {
            throw new NotFoundException(`User with name "${name}" is not found`);
        }

        return users;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                products: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with email "${email}" is not found`);
        }

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        await this.findOne(id);

        if (updateUserDto.email) { 
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });

            if (existingUser && existingUser.id !== id) {
                throw new ConflictException(`Email "${updateUserDto.email}" already exists`);
            }
        }

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    async remove(id: string): Promise<{ message: string }> {
        await this.findOne(id);

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: 'User deleted successfully'};
    }
}
