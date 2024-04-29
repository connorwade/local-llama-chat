import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/server/schema.ts",
  out: "./drizzle-dev",
  driver: "better-sqlite",
  dbCredentials: {
    url: ":memory:",
  },
} satisfies Config;
