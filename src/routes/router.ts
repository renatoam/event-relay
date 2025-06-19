import type { FastifyInstance } from "fastify"

export default async function router(fastify: FastifyInstance) {
  fastify.get("/", async (_request, reply) => {
    return reply.status(200).send({
      message: "Hello, World!",
    })
  })
}
