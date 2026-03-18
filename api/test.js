export default async function handler(req, res) {
  const BASE = process.env.UPSTASH_REDIS_REST_URL;
  const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  try {
    const r = await fetch(`${BASE}/set/teste/funcionando`, {
      method: "GET",
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const d = await r.json();
    res.status(200).json({ ok: true, result: d });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
