import * as bcrypt from 'bcrypt';

export const generatePasswordHash = (password: string) => {
  const salt = parseInt(process.env.CRYPT_SALT, 10);
  return bcrypt.hash(password, salt);
};

export const validatePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
