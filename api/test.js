export default async function handler(req, res) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  // Testa salvar uma sessão real
  const testData = JSON.stringify({
    partA: { name: "Caroline", email: "teste@teste.com" },
    topic: "teste de sessao",
    phase: "intake_a"
  });

  try {
    const r = await fetch(`${url}/set/${encodeURIComponent("session:TESTE-SESSION")}/${encodeURIComponent(testData)}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const d = await r.json();
    return res.status(200).json({ ok: true, result: d });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
