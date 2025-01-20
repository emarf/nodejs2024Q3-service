import * as bcrypt from 'bcrypt';

export const generatePasswordHash = (password: string) => {
  const salt = parseInt(process.env.CRYPT_SALT, 10);
  return bcrypt.hash(password, salt);
};

export const validatePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const sanitizeSensitiveData = (body) => {
  if (!body || typeof body !== 'object') return body;
  const fieldsToSanitize = ['password', 'accessToken', 'refreshToken', 'token'];

  const sanitizedBody = { ...body };

  for (const field in body) {
    if (fieldsToSanitize.includes(field)) {
      sanitizedBody[field] = '***';
    }
  }

  return sanitizedBody;
};
