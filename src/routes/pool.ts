import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function poolRoutes(fastify: FastifyInstance) {
  //Inicio bloco de códigos referente ao  bolão
  fastify.get('/pools/count', async () => { //Contagem de bolão criadas
    const count = await prisma.pool.count()

    return { count }
  })
  fastify.post('/pools', async (request, reply) => { //validação para o titulo do bolão nunca vim vazio
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(request.body)
    const generate = new ShortUniqueId({ length: 6 }) //Geração do código único do bolão
    const code = String(generate()).toUpperCase()

    try {
      await request.jwtVerify()
      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,
          participants: {
            create: {
              userId: request.user.sub
            }
          }
        }
      })
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code,
        }
      })
    }



    return reply.status(201).send({ code })

  })



}