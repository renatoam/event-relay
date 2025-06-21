import rabbitPlugin from 'fastify-plugin';
import amqp from 'amqplib';

export default rabbitPlugin(async (fastify) => {
  const queueConnection = await amqp.connect(process.env.RABBIT_URL ?? 'amqp://localhost');
  const exchange = 'tasks.exchange';
  const createRoutingKey = 'tasks.create';

  fastify.decorate('rabbit', {
    connection: queueConnection,
    exchange,
    createRoutingKey,
  })

  fastify.addHook('onClose', async (fastifyInstance) => {
    await queueConnection.close();
  });
})

export type RabbitPlugin = {
  connection: amqp.ChannelModel;
  exchange: string;
  createRoutingKey: string;
};
