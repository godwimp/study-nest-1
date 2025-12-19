export class CreateProductDto {
    name: string;
    price: number;
    stock: number;
}

export class UpdateProductDto {
    name?: string;
    price?: number;
    stock?: number;
}