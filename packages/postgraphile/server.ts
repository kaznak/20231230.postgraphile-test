#!/usr/bin/env -S npx ts-node

import "dotenv/config";
import Fastify from "fastify";

/*****************************************************/
const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
};

/*****************************************************/
const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: config.port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
