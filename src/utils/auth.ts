import crypto from 'crypto';

const hashPassword = (password: string, salt: string) =>
  crypto.createHmac('sha256', salt).update(password).digest('hex');

// const parseJwt = (token: string) => {
//   let base64Url = token.split('.')[1];
//   let base64 = base64Url.replace('-', '+').replace('_', '/');
//   return JSON.parse(atob(base64));
// };

export { hashPassword };
