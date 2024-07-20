/* eslint-disable no-unused-vars */
// Read the .env file.
// Register your application as a normal plugin.
// Require the framework
import FastifyNext from '@fastify/nextjs';
import FormBody from '@fastify/formbody';
import Multipart from '@fastify/multipart';
import Session from '@fastify/session';
import Cookie from '@fastify/cookie';
import Proxy from '@fastify/http-proxy';

import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from 'close-with-grace';
import dotenv from 'dotenv';
import AutoLoad from '@fastify/autoload';
import path from 'path';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import { API_URL } from './config';

export const options = {};
dotenv.config();
// Instantiate Fastify with some config
const app: any = Fastify({
  logger: true,
  pluginTimeout: 120000,
});

// Place here your custom code!
// Do not touch the following lines
// This loads all plugins defined in plugins
// those should be support plugins that are reused
// through your application

app.register(FastifyNext).after(() => app.next('/*'));
app.register(Cookie, {
  secret: process.env.SECRET, // Required, used for cookie signing
  parseOptions: {}, // Optional, options for the cookie parsing library (cookie package)
  setOptions: {
    path: '/', // Optional, cookie path
    expires: new Date(+new Date() + 24 * 60 * 60 * 1000), // Optional, cookie expiration in milliseconds
    httpOnly: true, // Optional, cookie is only accessible through HTTP(S) headers
    secure: process.env.NODE_ENV !== 'development',
  },
  sendOptions: {}, // Optional, options for the cookie sending library (fastify-cookie package)
});
app.register(Session, {
  secret: process.env.SECRET,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true, // Optional, cookie is only accessible through HTTP(S) headers
    secure: process.env.NODE_ENV !== 'development',
  },
  store: new RedisStore({
    client: new Redis({
      db: Number(process.env?.REDIS_SESSION ?? 4),
      enableAutoPipelining: true,
    }),
  }),
});
app.register(FormBody);
app.register(Multipart);
app.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins'),
});
app.register(Proxy, {
  upstream: `${process.env.NEXT_PUBLIC_API_URL}/api/qsolog`,
  prefix: '/api/qsolog', // optional
  http2: false, // optional
});

// This loads all plugins defined in routes
// define your routes in one of these
app.register(AutoLoad, {
  dir: path.join(__dirname, 'routes'),
});

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace(
  { delay: (process.env.FASTIFY_CLOSE_GRACE_DELAY ?? 500) as number },
  async ({ signal, err, manual }) => {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  }
);

app.addHook(
  'onRequest',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { db } = app;
    // onRequest 早于 preHandler
    // console.log(request.url);
    // await db.sequelize.query("select 'onRequest'");
    await db.sequelize.query(
      "SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));"
    );
  }
);

app.addHook(
  'preHandler',
  async (request: FastifyRequest, reply: FastifyReply) => {
    // const { db } = app;
    //console.log(request.url);
    // await db.sequelize.query("select 'preHandler'");
  }
);

app.addHook('onClose', (instance: any, done: any) => {
  closeListeners.uninstall();
  done();
});
// Start listening.
app.listen(
  {
    host: process.env.HOST || '0.0.0.0',
    port: (process.env.PORT || 3000) as number,
  },
  async (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  }
);
export default app;
