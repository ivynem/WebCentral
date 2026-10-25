import { createHealthResponse } from "../src/health.js";

export async function GET(): Promise<Response> {
  return createHealthResponse();
}
