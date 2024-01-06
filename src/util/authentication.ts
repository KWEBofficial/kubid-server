import { promisify } from 'util';
import {
  pbkdf2 as pbkdf2_not_using_promise,
  randomBytes as randomBytes_not_using_promise,
} from 'crypto';

const pbkdf2 = promisify(pbkdf2_not_using_promise);
const randomBytes = promisify(randomBytes_not_using_promise);

const ALGO: string = 'sha512';
const encoding: BufferEncoding = 'base64';

export const generateHashedPassword = async (password: string) => {
  const KEY_LEN = 64;
  const salt = await randomBytes(32);
  const iter = Math.floor(Math.random() * 20000) + 200000;
  const digest = await pbkdf2(password, salt, iter, KEY_LEN, ALGO);
  return `${ALGO}:${salt.toString(
    encoding,
  )}:${iter}:${KEY_LEN}:${digest.toString(encoding)}`;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  const [algo, encodedSalt, iterStr, keyLenStr, encodedDigest] =
    hashedPassword.split(':');
  const salt = Buffer.from(encodedSalt, encoding);
  const iter = parseInt(iterStr, 10);
  const keyLen = parseInt(keyLenStr, 10);
  const storedDigest = Buffer.from(encodedDigest, encoding);
  const digest = await pbkdf2(password, salt, iter, keyLen, algo);
  return Buffer.compare(digest, storedDigest) === 0;
};

module.exports = { generateHashedPassword, verifyPassword };
