#!/usr/bin/env -S npx ts-node

import "dotenv/config";
import Fastify, { RouteHandlerMethod } from "fastify";

/**************************************************************
 * Configuration
 **************************************************************/
const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
};

/**************************************************************
 * Create the server and middlewares
 **************************************************************/
const fastify = Fastify({
  logger: true,
});

const helloMiddleware: RouteHandlerMethod = async (_request, _reply) => {
  return { hello: "world" };
};

/**************************************************************
 * Define the routes
 **************************************************************/
fastify.get("/", helloMiddleware);

/**************************************************************
 * Run the server!
 **************************************************************/
const start = async () => {
  try {
    await fastify.listen({ port: config.port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
