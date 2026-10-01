import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    mockReset: true,
    unstubEnvs: true,
    // next-auth imports "next/server" without an extension, which Node's ESM
    // resolver rejects; inlining lets Vite resolve it.
    server: { deps: { inline: ["next-auth"] } },
  },
});
