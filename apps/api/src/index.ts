import { Elysia, t } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";

const isCloudflare = typeof globalThis.caches !== "undefined";

const app = new Elysia(isCloudflare ? { adapter: CloudflareAdapter } : {})
  .get("/", () => ({ status: "ok" }))
  .get("/health", () => ({ healthy: true, timestamp: new Date().toISOString() }))
  .post(
    "/echo",
    ({ body }) => body,
    {
      body: t.Object({ message: t.String() }),
    }
  )
  // .compile() is required, it triggers AoT compilation at startup
  .compile();

// Start a standalone server when running outside Cloudflare Workers
if (!isCloudflare) {
  app.listen(8787, () => {
    console.log(`🦊 Elysia is running at http://localhost:8787`);
  });
}

export default app;
