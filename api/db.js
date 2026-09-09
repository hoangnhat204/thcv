import { neon } from '@neondatabase/serverless';

export function database() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL chưa được cấu hình trên Vercel.');
  return neon(url);
}

export function json(res, status, body) {
  res.status(status).json(body);
}
