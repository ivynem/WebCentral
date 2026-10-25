import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createHealthResponse } from "./health.js";

const port = Number(process.env.PORT ?? 3000);
const staticFiles: Record<string, { file: string; contentType: string }> = {
  "/": { file: "../../index.html", contentType: "text/html; charset=utf-8" },
  "/roadmap.html": {
    file: "../../roadmap.html",
    contentType: "text/html; charset=utf-8",
  },
  "/database.html": {
    file: "../../database.html",
    contentType: "text/html; charset=utf-8",
  },
  "/activity.html": {
    file: "../../activity.html",
    contentType: "text/html; charset=utf-8",
  },
  "/styles.css": {
    file: "../../styles.css",
    contentType: "text/css; charset=utf-8",
  },
  "/app.js": {
    file: "../../app.js",
    contentType: "text/javascript; charset=utf-8",
  },
};

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

  if (request.method === "GET" && pathname === "/api/health") {
    const healthResponse = await createHealthResponse();
    response.writeHead(healthResponse.status, {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    });
    response.end(await healthResponse.text());
    return;
  }

  const asset = request.method === "GET" ? staticFiles[pathname] : undefined;
  if (!asset) {
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "not_found" }));
    return;
  }

  try {
    const body = await readFile(new URL(asset.file, import.meta.url));
    response.writeHead(200, {
      "content-type": asset.contentType,
      "cache-control": "no-cache",
      "x-content-type-options": "nosniff",
      "referrer-policy": "same-origin",
    });
    response.end(body);
  } catch {
    response.writeHead(500, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "asset_unavailable" }));
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`ForgeDesk listening on port ${port}`);
});
