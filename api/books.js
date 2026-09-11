import { database, json } from './db.js';

export default async function handler(req, res) {
  try {
    const sql = database();
    if ((req.method === 'GET' || req.method === 'HEAD') && req.query?.file) {
      if (!/^[0-9a-f-]{36}$/i.test(req.query.file)) return json(res, 400, { error: 'Mã tệp không hợp lệ.' });
      const rows = await sql`SELECT file_name, mime_type, content FROM books WHERE id = ${req.query.file}::uuid`;
      const book = rows[0];
      if (!book || !/\.pptx?$/i.test(book.file_name)) return json(res, 404, { error: 'Không tìm thấy bài trình chiếu.' });
      const bytes = Buffer.from(book.content, 'base64');
      res.setHeader('Content-Type', book.file_name.toLowerCase().endsWith('.pptx') ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'application/vnd.ms-powerpoint');
      res.setHeader('Content-Disposition', `inline; filename="presentation.${book.file_name.toLowerCase().endsWith('.pptx') ? 'pptx' : 'ppt'}"`);
      res.setHeader('Content-Length', bytes.length);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.status(200);
      return req.method === 'HEAD' ? res.end() : res.end(bytes);
    }
    if (req.method === 'GET') {
      const books = await sql`SELECT id, title, file_name AS "fileName", mime_type AS "mimeType", CASE WHEN (lower(file_name) LIKE '%.ppt' OR lower(file_name) LIKE '%.pptx') THEN '' ELSE content END AS content, uploaded_at AS "uploadedAt" FROM books ORDER BY uploaded_at DESC`;
      return json(res, 200, { books });
    }
    if (req.method === 'POST') {
      const book = req.body;
      if (!book?.title || typeof book.content !== 'string') return json(res, 400, { error: 'Dữ liệu sách không hợp lệ.' });
      if (/\.pptx?$/i.test(book.fileName || '')) {
        const bytes = Buffer.from(book.content, 'base64');
        const pptx = book.fileName.toLowerCase().endsWith('.pptx');
        const valid = pptx ? bytes.subarray(0, 4).equals(Buffer.from([80, 75, 3, 4])) : bytes.subarray(0, 8).equals(Buffer.from([208, 207, 17, 224, 161, 177, 26, 225]));
        if (!valid) return json(res, 400, { error: 'Tệp PowerPoint không hợp lệ.' });
      }
      const rows = await sql`INSERT INTO books (title, file_name, mime_type, content) VALUES (${book.title}, ${book.fileName || ''}, ${book.mimeType || 'text/plain'}, ${book.content}) RETURNING id, title, file_name AS "fileName", mime_type AS "mimeType", content, uploaded_at AS "uploadedAt"`;
      const saved = rows[0];
      if (/\.pptx?$/i.test(saved.fileName)) saved.content = '';
      return json(res, 201, { book: saved });
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
