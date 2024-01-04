import { promisify } from 'util';
import {
  pbkdf2 as pbkdf2_not_using_promise,
  randomBytes as randomBytes_not_using_promise,
} from 'crypto';

const pbkdf2 = promisify(pbkdf2_not_using_promise);
const randomBytes = promisify(randomBytes_not_using_promise);

export const generateHashedPassword = async (password: string) => {
  const ALGO = 'sha512';
  const KEY_LEN = 64;
  const salt = await randomBytes(32);
  const iter = Math.floor(Math.random() * 20000) + 200000;
  const digest = await pbkdf2(password, salt, iter, KEY_LEN, ALGO);
  return `${ALGO}:${salt.toString(
    'base64',
  )}:${iter}:${KEY_LEN}:${digest.toString('base64')}`;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  const [algo, encodedSalt, iterStr, keyLenStr, encodedDigest] =
    hashedPassword.split(':');
  const salt = Buffer.from(encodedSalt, 'base64');
  const iter = parseInt(iterStr, 10);
  const keyLen = parseInt(keyLenStr, 10);
  const storedDigest = Buffer.from(encodedDigest, 'base64');
  const digest = await pbkdf2(password, salt, iter, keyLen, algo);
  return Buffer.compare(digest, storedDigest) === 0;
};

module.exports = { generateHashedPassword, verifyPassword };
