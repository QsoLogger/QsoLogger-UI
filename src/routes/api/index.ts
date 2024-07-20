const api = async (fastify: any) => {
  fastify.get('/', (request: any, reply: any) => {
    reply.send({ message: 'api v1 is ready!', version: process.env.VERSION });
    return reply;
  });
};
export default api;
