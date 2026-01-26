import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const PORT = process.env.PORT || 3000;
const PAGE_ID = process.env.PAGE_ID;
const IG_ID = process.env.IG_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const GRAPH_BASE = "https://graph.facebook.com/v20.0";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": contentTypes[".json"] });
  res.end(JSON.stringify(payload, null, 2));
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || "Erro ao acessar a API";
    throw new Error(message);
  }
  return data;
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.url?.startsWith("/api/followers")) {
      if (!PAGE_ID || !IG_ID || !ACCESS_TOKEN) {
        return sendJson(res, 400, {
          message: "Defina PAGE_ID, IG_ID e ACCESS_TOKEN nas variáveis de ambiente.",
        });
      }
      const facebook = await fetchJson(
        `${GRAPH_BASE}/${PAGE_ID}?fields=followers_count&access_token=${ACCESS_TOKEN}`
      );
      const instagram = await fetchJson(
        `${GRAPH_BASE}/${IG_ID}?fields=followers_count&access_token=${ACCESS_TOKEN}`
      );
      return sendJson(res, 200, {
        facebookFollowers: facebook.followers_count ?? 0,
        instagramFollowers: instagram.followers_count ?? 0,
        fetchedAt: new Date().toISOString(),
      });
    }

    const requestPath = req.url === "/" ? "/index.html" : req.url;
    const filePath = join(process.cwd(), requestPath);
    const extension = extname(filePath);
    const file = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
    });
    res.end(file);
  } catch (error) {
    if (req.url?.startsWith("/api")) {
      return sendJson(res, 500, { message: error.message });
    }
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Não encontrado");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
