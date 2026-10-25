import { checkDatabaseConnection } from "./database.js";

type DatabaseCheck = () => Promise<void>;

export async function createHealthResponse(
  checkDatabase: DatabaseCheck = checkDatabaseConnection,
): Promise<Response> {
  try {
    await checkDatabase();
    return Response.json(
      { status: "ok", database: "connected" },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "error", database: "unavailable" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
