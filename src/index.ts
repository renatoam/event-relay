import fastify from "fastify";
import router from "./routes/router";

const app = fastify({
  logger: true,
});

app.register(router)

try {
  await app.listen({ port: 3001,  })
} catch (error) {
  app.log.error(error);
  process.exit(1);  
}
