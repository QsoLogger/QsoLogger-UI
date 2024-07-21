import Debug from 'debug';
import { FastifyReply, FastifyRequest } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import { uniqueId } from 'lodash-es';

const debug = Debug(`${__filename}:`);

const googleApi = async (fastify: any) => {
  fastify.post(
    '/google',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { User } = fastify.db;
      const { token } = request.body as { token: string };

      const oAuth2Client = new OAuth2Client();
      const data = await oAuth2Client.verifyIdToken({
        idToken: token,
      });
      const { name, email, email_verified, exp, nbf, picture } =
        data?.payload || {};
      const now = Number(+new Date() / 1000);
      if (now < nbf || now > exp) throw { message: 'token invalid' };
      const user = (await User.findOne({ where: { email } })).toJSON();
      const result = {
        ...user,
        username: user.username ? user.username : email,
        name,
        token,
        status: !user.status ? Number(email_verified) : user.status,
        avatar_url: picture,
        userIp: request.ip,
        loginAt: new Date(),
      };
      await User.upsert(result);
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
  );
};

export default googleApi;
