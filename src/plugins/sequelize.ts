import fp from 'fastify-plugin';
import models from '../models';

export default fp((fastify: any, opts, done) => {
  fastify.decorate('db', models);
  return done();
});
