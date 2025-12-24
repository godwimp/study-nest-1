console.log('Importing Prisma Client...');
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
console.log('Prisma Client imported');

const prisma = new PrismaClient();
console.log('Prisma Client instantiated');

const SALT_ROUNDS = 10;

async function main() {
    console.log('Start seeding ...');

    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    console.log('Cleared existing data');

    // Seed User
    const defaultPassword = await bcrypt.hash('password123', SALT_ROUNDS);
    const usersData = Array.from({ length: 10 }).map((_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@mail.com`,
        age: 18 + i,
        password: defaultPassword,
    }));
    await prisma.user.createMany({
        data: usersData,
    });

    const users = await prisma.user.findMany();
    console.log(`Created ${users.length} users`);


    // Seed Products
    const productsData: any[] = [];
    let productCounter = 1;
    
    for (const user of users) {
        const productCount = Math.floor(Math.random() * 10) + 1;

        for (let i = 0; i < productCount && productCounter <= 100; i++) {
            productsData.push({
                name: `Product ${productCounter}`,
                price: 10000 + productCounter * 500,
                stock: Math.floor(Math.random() * 50) + 1,
                ownerId: user.id,
            });

            productCounter++;
        }
    }

    // If total product < 100, add random user
    while (productCounter <= 100) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        productsData.push({
            name: `Product ${productCounter}`,
            price: 10000 + productCounter * 500,
            stock: Math.floor(Math.random() * 50) + 1,
            ownerId: randomUser.id,
        });

        productCounter++;
    }

    await prisma.product.createMany({
        data: productsData,
    });

    console.log('Seed finished');
    console.log(`Users created: ${users.length}`);
    console.log(`Products created: ${productsData.length}`);
}

main()
    .catch((error) => {
        console.error('Seeding error: ', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });