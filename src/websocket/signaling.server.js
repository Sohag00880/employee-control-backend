const { WebSocketServer } = require("ws");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const clients = new Map();

const send = (ws, payload) => {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
};

const authenticateSocket = async (request) => {
  const url = new URL(request.url, "http://localhost");
  const token = url.searchParams.get("token");

  if (!token) throw new Error("Missing token");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.sub);

  if (!user || !user.isActive) throw new Error("Invalid user");

  return user;
};

const setupSignalingServer = (server) => {
  const wss = new WebSocketServer({
    server,
    path: process.env.WS_PATH || "/ws"
  });

  wss.on("connection", async (ws, request) => {
    try {
      const user = await authenticateSocket(request);
      const userId = user._id.toString();

      clients.set(userId, {
        ws,
        role: user.role,
        name: user.name
      });

      user.presence.online = true;
      user.presence.lastSeenAt = new Date();
      await user.save();

      send(ws, {
        type: "connected",
        userId,
        role: user.role
      });

      ws.on("message", async (raw) => {
        try {
          const message = JSON.parse(raw.toString());

          /*
           * WebRTC signaling messages are routed but media never passes
           * through this server.
           *
           * Expected:
           * {
           *   type: "offer" | "answer" | "ice-candidate",
           *   targetUserId: "...",
           *   payload: {...}
           * }
           */

          const targetId = message.targetUserId;

          if (!targetId) {
            return send(ws, {
              type: "error",
              message: "targetUserId is required"
            });
          }

          const target = clients.get(targetId);

          if (!target) {
            return send(ws, {
              type: "peer-offline",
              targetUserId: targetId
            });
          }

          send(target.ws, {
            type: message.type,
            fromUserId: userId,
            payload: message.payload || null
          });
        } catch (error) {
          send(ws, {
            type: "error",
            message: "Invalid WebSocket message"
          });
        }
      });

      ws.on("close", async () => {
        const current = clients.get(userId);

        if (current && current.ws === ws) {
          clients.delete(userId);

          try {
            await User.findByIdAndUpdate(userId, {
              "presence.online": false,
              "presence.lastSeenAt": new Date()
            });
          } catch (error) {
            console.error("Presence update failed:", error.message);
          }
        }
      });
    } catch (error) {
      send(ws, {
        type: "error",
        message: "WebSocket authentication failed"
      });
      ws.close(1008, "Unauthorized");
    }
  });

  console.log(`WebSocket signaling server ready on ${process.env.WS_PATH || "/ws"}`);

  return wss;
};

module.exports = setupSignalingServer;