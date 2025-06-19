import fastify from "fastify";
import router from "./routes/router";

if (process.env.NODE_ENV !== 'production') {
  import('@dotenvx/dotenvx').then(({ config }) => config())
}

const app = fastify({
  logger: true,
});

app.register(router)

try {
  await app.listen({
    port: Number(process.env.PORT) || 4000,
    host: '0.0.0.0'
  })
} catch (error) {
  app.log.error(error);
  process.exit(1);  
}
