import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
    prismaClient: PrismaClient | undefined;
}

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

export const db = globalForPrisma.prismaClient ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaClient = db;
