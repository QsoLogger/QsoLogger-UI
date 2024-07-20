import { sleep } from '@utils/sleep';
import { flatMap } from 'lodash-es';

const v1 = async (fastify: any) => {
  fastify.get('/', async (request: any, reply: any) => reply.send({ message: 'api v1!' }));
  fastify.get('/test', async (request: any, reply: any) => {
    await sleep(500);
    reply.send(request.session);
    return reply;
  });
  fastify.get('/version', async (request: any, reply: any) => {
    reply.send({
      package_name: process.env.npm_package_name,
      package_version: process.env.npm_package_version,
      git_version: process.env.VERSION,
    });
    return reply;
  });

  fastify.get('/env', async (request: any, reply: any) => {
    const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('_')));
    const { db } = fastify;
    // await db.sequelize.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));");
    const result: any = flatMap(await db.sequelize.query('select @@SESSION.sql_mode sql_mode'));
    reply.send({ ...env, ...(result[0] ?? {}) });
    return reply;
  });
};

export default v1;
