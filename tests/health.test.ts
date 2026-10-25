import { describe, expect, it, vi } from "vitest";
import { createHealthResponse } from "../src/health.js";

describe("createHealthResponse", () => {
  it("returns a successful response when the database check succeeds", async () => {
    const response = await createHealthResponse(async () => undefined);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ok",
      database: "connected",
    });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("returns a generic unavailable response without leaking database errors", async () => {
    const checkDatabase = vi.fn(async () => {
      throw new Error("sensitive connection string");
    });
    const response = await createHealthResponse(checkDatabase);

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      status: "error",
      database: "unavailable",
    });
    expect(checkDatabase).toHaveBeenCalledOnce();
  });
});
