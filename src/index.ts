import fastify from "fastify";
import router from "./routes/router";
import '@dotenvx/dotenvx/config'

const app = fastify({
  logger: true,
});

app.register(router)

try {
  await app.listen({ port: Number(process.env.PORT) || 4000,  })
} catch (error) {
  app.log.error(error);
  process.exit(1);  
}
