import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Product } from './interfaces/product.interface';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
    private products: Product[] = [];
    create(createProductDto: CreateProductDto): Product {
        const newProduct: Product = {
            id: randomUUID(),
            ...createProductDto,
            createdAt: new Date(),
        };
        this.products.push(newProduct);
        return newProduct;
    }

    findAll(): Product[] {
        return this.products
    }

    findOne(id: string): Product {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} is not found`);
        }
        return product;
    }

    update(id: string, updateProductDto: UpdateProductDto): Product {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new NotFoundException(`Product with ID ${id} is not found`);
        }
        this.products[index] = {
            ...this.products[index],
            ...updateProductDto,
        };
        return this.products[index];
    }

    remove(id: string): { message: string } {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new NotFoundException(`Product with ID ${id} is not found`);
        }
        this.products.splice(index, 1);
        return { message: 'Product deleted' };
    }
}
