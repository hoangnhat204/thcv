export async function uploadPresentation(file, title, progress = () => {}) {
  const uploadId = crypto.randomUUID();
  // Multiples of three bytes avoid padding between base64 chunks.
  const chunkSize = 768 * 1024;
  const parts = Math.ceil(file.size / chunkSize);
  if (!parts) throw new Error('Tệp đang trống.');
  async function send(body) {
    const response = await fetch('/api/book-upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, uploadId }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Không tải được tệp (HTTP ${response.status}). Vui lòng thử lại.`);
    return payload;
  }
  for (let part = 0; part < parts; part++) {
    const bytes = new Uint8Array(await file.slice(part * chunkSize, (part + 1) * chunkSize).arrayBuffer());
    let raw = '';
    for (let i = 0; i < bytes.length; i += 8192) raw += String.fromCharCode(...bytes.subarray(i, i + 8192));
    await send({ action: 'chunk', part, content: btoa(raw) });
    progress(Math.round((part + 1) / parts * 100));
  }
  return (await send({ action: 'complete', parts, title, fileName: file.name })).book;
}
