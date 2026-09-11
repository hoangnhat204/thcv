import { database, json } from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'DELETE') {
      const { roomId, index } = req.body || {};
      if (typeof roomId !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(roomId) || !Number.isInteger(index) || index < 0) return json(res, 400, { error: 'Dữ liệu cây không hợp lệ.' });
      const sql = database();
      await sql`DELETE FROM plants WHERE room_id = ${roomId} AND plot_index = ${index}`;
      return json(res, 200, { ok: true });
    }
    const sql = database();
    if (req.method === 'GET') {
      const rows = await sql`SELECT room_id, plot_index, flower_id, stage, grower_name, grower_school, grower_message, planted_at FROM plants ORDER BY planted_at DESC`;
      return json(res, 200, { plants: rows });
    }
    if (req.method !== 'PUT') return json(res, 405, { error: 'Phương thức không được hỗ trợ.' });
    const plants = Array.isArray(req.body?.plants) ? req.body.plants : [];
    for (const plant of plants) {
      if (!plant?.roomId || !Number.isInteger(plant.index) || !plant.flower) continue;
      await sql`
        INSERT INTO plants (room_id, plot_index, flower_id, stage, grower_name, grower_school, grower_message, planted_at)
        VALUES (${plant.roomId}, ${plant.index}, ${plant.flower}, ${plant.stage ?? 0}, ${plant.grower?.name ?? ''}, ${plant.grower?.school ?? ''}, ${plant.grower?.message ?? ''}, to_timestamp(${Number(plant.plantedAt || Date.now())} / 1000.0))
        ON CONFLICT (room_id, plot_index) DO UPDATE SET flower_id = EXCLUDED.flower_id, stage = EXCLUDED.stage, grower_name = EXCLUDED.grower_name, grower_school = EXCLUDED.grower_school, grower_message = EXCLUDED.grower_message, planted_at = EXCLUDED.planted_at
      `;
    }
    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
