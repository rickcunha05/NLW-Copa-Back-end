import { PrismaClient } from "@prisma/client";

//Conexão do banco de dados para pode utilizar ela em toda aplicação
export const prisma = new PrismaClient({
    log: ['query']
})