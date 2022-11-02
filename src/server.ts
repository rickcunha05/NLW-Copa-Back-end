import Fastify from "fastify";
import cors from "@fastify/cors"
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import ShortUniqueI from 'short-unique-id'
import ShortUniqueId from "short-unique-id";

//tratamento de log para saber todas as querys executadas no banco
const prisma = new PrismaClient({
  log: ['query']
})
async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
  })
  //Inicio bloco de codigos referente ao  bolão
  fastify.get('/pools/count', async () => { //Contagem de bolão criadas
    const count = await prisma.pool.count()

    return { count }
  })
  fastify.post('/pools', async (request, reply) => { //validação para o titulo do bolão nunca vim vazio
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(request.body)
    const generate = new ShortUniqueId({ length: 6 }) //Geração do codigo unico do bolão
    const code = String(generate()).toUpperCase()

    await prisma.pool.create({
      data: {
        title,
        code: String(generate()).toUpperCase()
      }
    })

    return reply.status(201).send({ code })

  })
  //

  fastify.get('/users/count', async () => {
    const count = await prisma.user.count()

    return { count }
  })
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()

    return { count }
  })



  await fastify.listen({ port: 3333 })
}

bootstrap()