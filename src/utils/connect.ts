import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { // Definición global de la instancia de prisma
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(); // Verificamos si hay una instancia de prisma y sino exite la creamos

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma