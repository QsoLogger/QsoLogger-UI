import { API_URL } from '@/src/config';
import axios from 'axios';

const api = async (fastify: any) => {
  // fastify.all('/*', async (request: any, reply: any) => {
  //   console.log(request);
  //   reply.send({ message: 'something went wrong!', API_URL });
  //   await axios
  //     .request(request)
  //     .then((res) => {
  //       console.log(res);
  //       console.log(process.env.VERSION);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   return reply;
  // });
  // fastify.get('/*', (request: any, reply: any) => {
  //   reply.send({ message: 'api v1 is ready!', version: process.env.VERSION });
  //   return reply;
  // });
  // fastify.post('/*', (request: any, reply: any) => {
  //   reply.send({ message: 'something went wrong!', API_URL });
  //   return reply;
  // });
};
export default api;
