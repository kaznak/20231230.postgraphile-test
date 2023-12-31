#!/usr/bin/env -S npx ts-node

import "dotenv/config";
import Fastify, { FastifyInstance, RouteHandlerMethod } from "fastify";
import {
  HttpRequestHandler,
  PostGraphileResponseFastify3,
  postgraphile,
} from "postgraphile";

/**************************************************************
 * Configuration
 **************************************************************/
const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  databaseUrl: process.env.DATABASE_URL,
  graphiql: process.env.GRAPHIQL ? process.env.GRAPHIQL === "true" : true,
};

/**************************************************************
 * Create the server and middlewares
 **************************************************************/
const fastify: FastifyInstance = Fastify({
  logger: true,
});

const postgraphileMiddleware: HttpRequestHandler = postgraphile(
  config.databaseUrl,
  "public",
  {
    /* ... options here ... */
    graphiql: config.graphiql,
  },
);

const convertHandler = (handler) => (request, reply) =>
  handler(new PostGraphileResponseFastify3(request, reply));

/**************************************************************
 * Define the routes
 **************************************************************/
fastify.options(
  postgraphileMiddleware.graphqlRoute,
  convertHandler(postgraphileMiddleware.graphqlRouteHandler),
);

// This is the main middleware
fastify.post(
  postgraphileMiddleware.graphqlRoute,
  convertHandler(postgraphileMiddleware.graphqlRouteHandler),
);

// GraphiQL, if you need it
if (postgraphileMiddleware.options.graphiql) {
  if (postgraphileMiddleware.graphiqlRouteHandler) {
    fastify.head(
      postgraphileMiddleware.graphiqlRoute,
      convertHandler(postgraphileMiddleware.graphiqlRouteHandler),
    );
    fastify.get(
      postgraphileMiddleware.graphiqlRoute,
      convertHandler(postgraphileMiddleware.graphiqlRouteHandler),
    );
  }
  // Remove this if you don't want the PostGraphile logo as your favicon!
  if (postgraphileMiddleware.faviconRouteHandler) {
    fastify.get(
      "/favicon.ico",
      convertHandler(postgraphileMiddleware.faviconRouteHandler),
    );
  }
}

// If you need watch mode, this is the route served by the
// X-GraphQL-Event-Stream header; see:
// https://github.com/graphql/graphql-over-http/issues/48
if (postgraphileMiddleware.options.watchPg) {
  if (postgraphileMiddleware.eventStreamRouteHandler) {
    fastify.options(
      postgraphileMiddleware.eventStreamRoute,
      convertHandler(postgraphileMiddleware.eventStreamRouteHandler),
    );
    fastify.get(
      postgraphileMiddleware.eventStreamRoute,
      convertHandler(postgraphileMiddleware.eventStreamRouteHandler),
    );
  }
}

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
