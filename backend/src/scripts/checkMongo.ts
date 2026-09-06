import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "../config/db.js";

dotenv.config();

async function main() {
  console.log("Checking MongoDB Atlas connection...");
  console.log(`URI host: ${(process.env.MONGODB_URI ?? "").replace(/:[^:@]+@/, ":***@")}`);

  if (process.env.MONGODB_TLS_ALLOW_INVALID_CERTS === "true") {
    console.log("Note: MONGODB_TLS_ALLOW_INVALID_CERTS=true (dev TLS workaround enabled)");
  }

  await connectDatabase();
  console.log("Connection successful.");
  await disconnectDatabase();
}

main().catch((error) => {
  console.error("Connection failed.");
  if (error instanceof Error) {
    console.error(error.message.split("\n")[0]);
  }
  process.exit(1);
});
