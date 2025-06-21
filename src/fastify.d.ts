// types/fastify.d.ts
import 'fastify';
import type { RabbitPlugin } from './config/rabbit';

declare module 'fastify' {
  interface FastifyInstance {
    rabbit: RabbitPlugin;
  }
}
