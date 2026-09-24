require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const setupSignalingServer = require("./websocket/signaling.server");

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  setupSignalingServer(server);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`HTTP API listening on port ${PORT}`);
    console.log(`WebSocket signaling path: ${process.env.WS_PATH || "/ws"}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
