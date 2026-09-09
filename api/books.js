import { database, json } from './db.js';

export default async function handler(req, res) {
  try {
    const sql = database();
    if (req.method === 'GET') {
      const books = await sql`SELECT id, title, file_name AS "fileName", mime_type AS "mimeType", content, uploaded_at AS "uploadedAt" FROM books ORDER BY uploaded_at DESC`;
      return json(res, 200, { books });
    }
    if (req.method === 'POST') {
      const book = req.body;
      if (!book?.title || typeof book.content !== 'string') return json(res, 400, { error: 'Dữ liệu sách không hợp lệ.' });
      const rows = await sql`INSERT INTO books (title, file_name, mime_type, content) VALUES (${book.title}, ${book.fileName || ''}, ${book.mimeType || 'text/plain'}, ${book.content}) RETURNING id, title, file_name AS "fileName", mime_type AS "mimeType", content, uploaded_at AS "uploadedAt"`;
      return json(res, 201, { book: rows[0] });
    }
    if (req.method === 'DELETE') {
      if (!req.query?.id) return json(res, 400, { error: 'Thiếu mã sách.' });
      await sql`DELETE FROM books WHERE id = ${req.query.id}::uuid`;
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { error: 'Phương thức không được hỗ trợ.' });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
