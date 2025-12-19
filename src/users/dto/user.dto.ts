import { IsString, IsEmail, IsInt, Min, Max, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsEmail({}, { message: 'Email is not valid, use a valid email' })
    email: string;

    @IsInt({ message: 'Age must be a number' })
    @Min(1, { message: 'Age must be greater than 1' })
    @Max(120, { message: 'Age must be less than 120' })
    age: number;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(120)
    age?: number;
}

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}