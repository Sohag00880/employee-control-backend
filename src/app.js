const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");
const monitoringRoutes = require("./routes/monitoring.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// Normalize configured origins so a trailing slash does not cause
// an otherwise valid browser Origin to fail CORS validation.
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN
      .split(",")
      .map((item) => item.trim().replace(/\/$/, ""))
      .filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin header (health checks, curl, server-to-server)
      // are allowed. Browser requests must match the configured allow-list.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Employee Monitor API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Employee Monitor API is running",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/monitoring", monitoringRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;