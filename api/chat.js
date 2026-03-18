export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { action, key, value } = req.body || {};
  const BASE = process.env.UPSTASH_REDIS_REST_URL;
  const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  const headers = { Authorization: `Bearer ${TOKEN}` };

  if (action === "get") {
    try {
      const r = await fetch(`${BASE}/get/${encodeURIComponent(key)}`, { headers });
      const d = await r.json();
      return res.status(200).json({ value: d.result });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (action === "set") {
    try {
      const encoded = encodeURIComponent(key);
      const r = await fetch(`${BASE}/set/${encoded}`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const d = await r.json();
      return res.status(200).json({ ok: true, result: d });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Chamada ao Claude
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
