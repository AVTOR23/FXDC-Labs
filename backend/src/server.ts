import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { createApp } from "./app.js";
import { logger } from "./utils/logger.js";
import { ensureStaffAccounts } from "./services/ensureStaff.js";

const app = createApp();

async function start() {
  await connectDatabase();
  await ensureStaffAccounts();

  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT}`);
    if (env.NODE_ENV !== "production") {
      console.log("[FXDC backend] API started");
    }
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

start().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
