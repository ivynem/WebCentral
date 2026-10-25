import { createServer } from "node:http";
import { createHealthResponse } from "./health.js";

const port = Number(process.env.PORT ?? 3000);

const server = createServer(async (request, response) => {
  if (request.method !== "GET" || request.url !== "/api/health") {
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "not_found" }));
    return;
  }

  const healthResponse = await createHealthResponse();
  response.writeHead(healthResponse.status, {
    "content-type": "application/json",
    "cache-control": "no-store",
  });
  response.end(await healthResponse.text());
});

server.listen(port, "0.0.0.0", () => {
  console.log(`ForgeDesk listening on port ${port}`);
});
