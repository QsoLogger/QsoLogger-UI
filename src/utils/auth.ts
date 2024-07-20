import crypto from 'crypto';

const hashPassword = (password: string, salt: string) =>
  crypto.createHmac('sha256', salt).update(password).digest('hex');

export { hashPassword };
