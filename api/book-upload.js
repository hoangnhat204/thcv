import { database, json } from './db.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Phương thức không được hỗ trợ.' });
  const body = req.body || {};
  if (!/^[0-9a-f-]{36}$/i.test(body.uploadId || '')) return json(res, 400, { error: 'Mã tải lên không hợp lệ.' });
  try {
    const sql = database();
    await sql`CREATE TABLE IF NOT EXISTS book_upload_chunks (upload_id UUID NOT NULL, part INTEGER NOT NULL, content TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(upload_id, part))`;
    if (body.action === 'chunk') {
      if (!Number.isInteger(body.part) || body.part < 0 || typeof body.content !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(body.content) || body.content.length > 1048576 || body.content.length % 4) return json(res, 400, { error: 'Phần tệp tải lên không hợp lệ.' });
      await sql`INSERT INTO book_upload_chunks (upload_id, part, content) VALUES (${body.uploadId}::uuid, ${body.part}, ${body.content}) ON CONFLICT (upload_id, part) DO UPDATE SET content = EXCLUDED.content`;
      return json(res, 200, { ok: true });
    }
    if (body.action !== 'complete' || !Number.isInteger(body.parts) || body.parts < 1 || typeof body.title !== 'string' || !body.title.trim() || typeof body.fileName !== 'string' || !/\.pptx?$/i.test(body.fileName)) return json(res, 400, { error: 'Thông tin bài trình chiếu không hợp lệ.' });
    const first = await sql`SELECT content FROM book_upload_chunks WHERE upload_id = ${body.uploadId}::uuid AND part = 0`;
    const bytes = Buffer.from(first[0]?.content || '', 'base64');
    const pptx = /\.pptx$/i.test(body.fileName);
    const signature = Buffer.from(pptx ? [80,75,3,4] : [208,207,17,224,161,177,26,225]);
    if (!bytes.subarray(0, signature.length).equals(signature)) return json(res, 400, { error: 'Tệp PowerPoint không hợp lệ.' });
    const mime = pptx ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'application/vnd.ms-powerpoint';
    const rows = await sql`
      WITH assembled AS (
        SELECT string_agg(content, '' ORDER BY part) AS content FROM book_upload_chunks WHERE upload_id = ${body.uploadId}::uuid
        HAVING count(*) = ${body.parts} AND min(part) = 0 AND max(part) = ${body.parts - 1}
      ), saved AS (
        INSERT INTO books (id, title, file_name, mime_type, content)
        SELECT ${body.uploadId}::uuid, ${body.title.trim()}, ${body.fileName}, ${mime}, content FROM assembled
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title
        RETURNING id, title, file_name AS "fileName", mime_type AS "mimeType", uploaded_at AS "uploadedAt"
      ), cleanup AS (DELETE FROM book_upload_chunks WHERE upload_id = ${body.uploadId}::uuid AND EXISTS (SELECT 1 FROM saved))
      SELECT *, '' AS content FROM saved`;
    if (!rows.length) return json(res, 409, { error: 'Tệp chưa tải đủ. Vui lòng thử lại.' });
    await sql`DELETE FROM book_upload_chunks WHERE created_at < NOW() - INTERVAL '1 day'`;
    return json(res, 201, { book: rows[0] });
  } catch (error) { return json(res, 500, { error: error.message }); }
}
