import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { ensureStaffAccounts } from "../services/ensureStaff.js";
import { logger } from "../utils/logger.js";

async function seedAdmin() {
  await connectDatabase();
  await ensureStaffAccounts();
  await disconnectDatabase();
}

seedAdmin().catch((error) => {
  logger.error("Failed to seed admin", error);
  process.exit(1);
});
