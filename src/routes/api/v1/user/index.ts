import { createClient } from 'redis';
import Debug from 'debug';
import { Op } from 'sequelize';
import { pick, uniqueId } from 'lodash-es';
import { hashPassword } from '@utils/auth';
import { FastifyReply, FastifyRequest } from 'fastify';

const debug = Debug(`${__filename}:`);

const userApi = async (fastify: any) => {
  const redis = createClient();
  redis.on('error', (err) => debug('Redis Client Error', err));
  await redis.connect();

  fastify.get('/', async (request: any) => {
    const { search, page = 0, pageSize = 100 } = request.query;
    const params: { username?: any; status?: any } = {};
    if (search) {
      params[Op.or] = {
        username: { [Op.like]: `%${search}%` },
        email: { [Op.like]: `%${search}%` },
      };
    }
    const { User } = fastify.db;
    const { rows, count } = await User.findAndCountAll({
      where: {
        ...params,
        status: {
          [Op.gte]: 0,
        },
      },
    });
    return {
      rows,
      count,
      pagination: {
        current: Number(page || 1).toFixed(),
        pageSize,
        total: count,
      },
    };
  });

  fastify.get(
    '/:id',
    async (
      request: FastifyRequest & {
        params: { id: number };
        session: { id: number };
      }
    ) => {
      const paramId = Number(request.params?.id);
      const sessionId = Number(request.session?.id);
      const id = paramId || sessionId;
      const { User } = fastify.db;
      if (id) {
        const user = await User.findByPk(id);
        return user;
      } else {
        return null;
      }
    }
  );

  fastify.post('/', async (request: any) => {
    const { ...user } = request.body;
    const { User } = fastify.db;
    const { isSuper } = request.session;
    const cnt = await User.count();
    if (isSuper || cnt === 0) {
      // 是管理员或是第一个用户
      const data = pick(user, [
        'username',
        'name',
        'callsign',
        'email',
        'passwd',
        'intro',
        'mobile',
        'address',
        'zip',
        'status',
      ]);
      console.log({ data });
      if (user.passwd && user.passwd === user.confirm)
        data.passwd = hashPassword(user.passwd, user.username);
      console.log({ data });
      const [result] = await User.scope('withPassword').upsert(data);
      return result;
    }
    throw new Error('Permission Denied');
  });

  fastify.post('/register', async (request: any) => {
    const { ...user } = request.body;
    const { User } = fastify.db;
    const data = pick(user, ['username', 'passwd']);
    const userExists = await User.count({
      where: {
        username: user.username,
      },
    });
    if (!userExists) {
      if (user.passwd) data.passwd = hashPassword(user.passwd, user.username);
      await User.upsert({
        ...data,
        email: `${user.username}@example.com`,
        status: 0,
        group: 0,
      });
    }
    return user;
  });

  fastify.post('/login', async (request: any, reply) => {
    const { username, passwd } = request.body;
    const { User } = fastify.db;
    if (username && passwd) {
      const result = await User.findOne({
        where: {
          username,
          passwd: hashPassword(passwd, username),
          status: 1,
        },
      });
      if (result?.id) {
        request.session.id = result.id;
        request.session.isSuper = result.group % 2 === 1;
        request.session.cookie.httpOnly = false;
        reply.setCookie('uid', uniqueId(`${result.id}.`), {
          httpOnly: false,
          secure: false,
          path: '/',
          expires: new Date(86400_000 + +new Date()),
        });
        reply.send(result);
        return reply;
      }
    }
    throw new Error('用户名或密码错误');
  });
  fastify.get('/logout', async (request: any, reply: FastifyReply) => {
    await request.session.destroy();
    reply.clearCookie('uid');
    return null;
  });

  fastify.delete('/:id', async (request: any) => {
    const { id } = request.params;
    const { User } = fastify.db;
    const { isSuper } = request.session;
    if (isSuper) {
      const user = await User.findByPk(id);
      user.status = -1;
      await user.save();
      return user;
    }
    throw new Error('Permission Denied');
  });

  fastify.post('/:id', async (request: any) => {
    const { id } = request.params;
    const { status } = request.body;
    const { User } = fastify.db;
    const { isSuper } = request.session;
    if (isSuper) {
      const user = await User.findByPk(id);
      user.status = status;
      await user.save();
      return user;
    }
    throw new Error('Permission Denied');
  });
};

export default userApi;
