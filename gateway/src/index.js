// ODR public download gateway. Serves the landing page from ./public and streams the latest signed
// installer from the public release repository through THIS domain, so the customer never sees GitHub.
const REPO = "moain2028/odr-apps";
const LATEST = `https://github.com/${REPO}/releases/latest/download/`;
const UPDATE_JSON = `https://raw.githubusercontent.com/${REPO}/main/odr/update.json`;

async function latestMeta() {
  try {
    const r = await fetch(UPDATE_JSON + "?t=" + Date.now(), { cf: { cacheTtl: 60 } });
    if (r.ok) return await r.json();
  } catch {}
  return null;
}

async function proxy(assetName, downloadName) {
  const upstream = await fetch(LATEST + assetName, { redirect: "follow", headers: { "User-Agent": "odr-download-gateway" } });
  if (!upstream.ok) return new Response("الملف غير متاح حالياً. حاول بعد قليل.", { status: 502, headers: { "content-type": "text/plain; charset=utf-8" } });
  const h = new Headers();
  h.set("content-type", upstream.headers.get("content-type") || "application/octet-stream");
  const len = upstream.headers.get("content-length"); if (len) h.set("content-length", len);
  h.set("content-disposition", `attachment; filename="${downloadName}"`);
  h.set("cache-control", "no-store");
  h.set("x-content-type-options", "nosniff");
  return new Response(upstream.body, { status: 200, headers: h });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    if (p === "/download" || p === "/download/" || p === "/ODR-Setup.exe")
      return proxy("ODR-Setup.exe", "ODR-Setup.exe");
    if (p === "/sha256")
      return proxy("ODR-Setup.exe.sha256", "ODR-Setup.exe.sha256");
    if (p === "/version") {
      const m = await latestMeta();
      return new Response(JSON.stringify(m || { error: "unavailable" }), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
    }
    return env.ASSETS.fetch(req);
  }
};
