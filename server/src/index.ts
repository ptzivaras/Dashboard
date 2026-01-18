import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./lib/auth.js";

import departmentsRouter from "./routes/departments.js";
import subjectsRouter from "./routes/subjects.js";
import classesRouter from "./routes/classes.js";
import enrollmentsRouter from "./routes/enrollments.js";
import usersRouter from "./routes/users.js";
import statsRouter from "./routes/stats.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth/**", (req, res) => auth.handler(req, res));

// API routes
app.use("/api/departments", departmentsRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/classes", classesRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/stats", statsRouter);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
