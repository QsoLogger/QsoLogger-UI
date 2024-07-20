const api = async (fastify: any) => {
  fastify.get('/', async (request: any, reply: any) => reply.nextRender('/'));
};
export default api;
