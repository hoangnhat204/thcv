// Minimal XLSX workbook with text cells, packaged as an uncompressed ZIP.
// Text cells preserve Vietnamese and never execute user messages as formulas.
const encode = value => new TextEncoder().encode(value);
const xml = value => String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function header(size, values) {
  const bytes = new Uint8Array(size);
  const view = new DataView(bytes.buffer);
  for (const [offset, width, value] of values) width === 4 ? view.setUint32(offset, value, true) : view.setUint16(offset, value, true);
  return bytes;
}
export function createWorkbook(rows) {
  const files = {
    '[Content_Types].xml': '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
    '_rels/.rels': '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml': '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Người gieo" sheetId="1" r:id="rId1"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels': '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
    'xl/worksheets/sheet1.xml': `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="2" width="22" customWidth="1"/><col min="3" max="4" width="60" customWidth="1"/><col min="5" max="7" width="24" customWidth="1"/></cols><sheetData>${rows.map((row, index) => `<row r="${index + 1}">${row.map(value => `<c t="inlineStr"><is><t xml:space="preserve">${xml(value)}</t></is></c>`).join('')}</row>`).join('')}</sheetData><autoFilter ref="A1:G${Math.max(1, rows.length)}"/></worksheet>`,
  };
  const parts = [], directory = [];
  let offset = 0, directorySize = 0;
  for (const [path, content] of Object.entries(files)) {
    const name = encode(path), data = encode(content), crc = crc32(data);
    const local = header(30, [[0, 4, 0x04034b50], [4, 2, 20], [12, 2, 33], [14, 4, crc], [18, 4, data.length], [22, 4, data.length], [26, 2, name.length]]);
    const central = header(46, [[0, 4, 0x02014b50], [4, 2, 20], [6, 2, 20], [14, 2, 33], [16, 4, crc], [20, 4, data.length], [24, 4, data.length], [28, 2, name.length], [42, 4, offset]]);
    parts.push(local, name, data);
    directory.push(central, name);
    offset += local.length + name.length + data.length;
    directorySize += central.length + name.length;
  }
  const count = Object.keys(files).length;
  const end = header(22, [[0, 4, 0x06054b50], [8, 2, count], [10, 2, count], [12, 4, directorySize], [16, 4, offset]]);
  return new Blob([...parts, ...directory, end], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
