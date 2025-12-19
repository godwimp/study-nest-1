import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from 'generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Cek owner exist
    const owner = await this.prisma.user.findUnique({
      where: { id: createProductDto.ownerId },
    });

    if (!owner) {
      throw new NotFoundException(`User with ID ${createProductDto.ownerId} can not be found`);
    }

    return this.prisma.product.create({
      data: createProductDto,
      include: {
        owner: true, // Include data owner
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        owner: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ID ${id} can not be found`);
    }

    return product;
  }

  async findByOwnerId(ownerId: string): Promise<Product[]> {
    // Cek owner exist
    const owner = await this.prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} can not be found`);
    }

    return this.prisma.product.findMany({
      where: { ownerId },
      include: {
        owner: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // Cek product exist
    await this.findOne(id);

    // Kalau update owner, cek owner baru exist
    if (updateProductDto.ownerId) {
      const owner = await this.prisma.user.findUnique({
        where: { id: updateProductDto.ownerId },
      });

      if (!owner) {
        throw new NotFoundException(`User with ID ${updateProductDto.ownerId} can not be found`);
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        owner: true,
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    // Cek product exist
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product sucessfully deleted' };
  }
}