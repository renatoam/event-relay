import type { FastifyInstance, RouteOptions } from "fastify"

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  order: number;
}

export default async function router(fastify: FastifyInstance) {
  const queueConnection = fastify.rabbit.connection
  const exchange = fastify.rabbit.exchange
  const createRoutingKey = fastify.rabbit.createRoutingKey
  
  const publishChannel = await queueConnection.createChannel()
  await publishChannel.assertExchange(exchange, "direct", { durable: true })
  
  const options: RouteOptions = {
    schema: {
      body: {
        type: "object",
        properties: {
          id: { type: "string" },
          description: { type: "string" },
          completed: { type: "boolean" },
          order: { type: "number" },
        },
        required: ["id", "description", "completed", "order"],
      },
    },
    url: "/producer",
    method: "POST",
    handler: async (request, reply) => {
      const sent = publishChannel.publish(exchange, createRoutingKey, Buffer.from(JSON.stringify(request.body)),{
        persistent: true,
        contentType: "application/json",
        contentEncoding: "utf-8",
      })

      if (!sent) {
        return reply.status(500).send({
          message: "Failed to send message to RabbitMQ",
        })
      }

      return reply.status(200).send({
        message: "Hello, World!",
      })
    }
  }

  fastify.post("/producer", options)

  fastify.get("/health", async (_request, reply) => {
    return reply.status(200).send({
      message: "Server is running",
    })
  })

  fastify.get("/health/rabbit", async (_request, reply) => {
    try {
      const channel = await queueConnection.createChannel()
      await channel.checkExchange(exchange)
      await channel.close()

      return reply.status(200).send({ rabbit: 'ok', exchange: 'exists' })
    } catch (error) {
      const err = error as Error
      fastify.log.error(err)
      return reply.status(500).send({ rabbit: 'error', message: err.message })
    }
  })
  
  fastify.get("/", async (_request, reply) => {
    return reply.status(200).send({
      message: "Welcome to the RabbitMQ Producer API",
    })
  })  
}
