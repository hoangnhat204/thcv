import { database, json } from './db.js';
import { DEFAULT_SCHOOLS } from '../school-defaults.js';
import { validateSchools } from '../schools.js';
export default async function handler(req, res) {
  if (!['GET', 'PUT'].includes(req.method)) return json(res, 405, { error: 'Phương thức không được hỗ trợ.' });
  let names;
  if (req.method === 'PUT') {
    try { names = validateSchools(req.body?.schools); } catch (error) { return json(res, 400, { error: error.message }); }
  }
  try {
    const sql = database();
    await sql`CREATE TABLE IF NOT EXISTS school_directory (id INTEGER PRIMARY KEY CHECK (id = 1), names JSONB NOT NULL)`;
    if (req.method === 'PUT') {
      await sql`INSERT INTO school_directory (id, names) VALUES (1, ${JSON.stringify(names)}::jsonb) ON CONFLICT (id) DO UPDATE SET names = EXCLUDED.names`;
      return json(res, 200, { schools: names });
    }
    const rows = await sql`SELECT names FROM school_directory WHERE id = 1`;
    return json(res, 200, { schools: rows[0]?.names ?? DEFAULT_SCHOOLS });
  } catch (error) { return json(res, 500, { error: error.message }); }
}
