import { IsString, IsInt, Min, IsUUID, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsInt({ message: 'Price must be an integer' })
  @Min(0, { message: 'Price minimal 0' })
  price: number;

  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Stock minimal 0' })
  stock: number;

  @IsUUID('4', { message: 'Owner ID must a valid UUID' })
  ownerId: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsUUID('4')
  ownerId?: string;
}