import Fastify from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { deckRoutes } from "./routes/decks";
import { cardRoutes } from "./routes/cards";

const app = Fastify({ logger: true });
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler((erro, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(erro)) {
    return reply.status(400).send({
      message: "Dados inválidos",
      issues: erro.validation,
    });
  }
  return reply.send(erro);
});

app.register(deckRoutes);
app.register(cardRoutes);

async function iniciar() {
  try {
    await app.listen({ port: 3333, host: "127.0.0.1" });
  } catch (erro) {
    app.log.error(erro);
    process.exit(1);
  }
}

iniciar();