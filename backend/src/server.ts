import { createApp } from "./app.js";
import { logger } from "./lib/logger.js";
import http from "node:http";
import { connectDB } from "./prisma.js";
import { env } from "./config/env.js";
import { initIo } from "./realtime/io.js";

async function startServer() {
  try {
    await connectDB();
    const app = createApp();
    const server = http.createServer(app);

    const port = Number(env.PORT) || 5000;

    initIo(server);

    server.listen(port, () => {
      logger.info(`Server is now listening to port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", `${(error as Error).message}`);
    process.exit(1);
  }
}
startServer();
