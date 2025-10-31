import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

// Import routes
import projectRoutes from "./routes/projects";
import textureRoutes from "./routes/textures";
import modelRoutes from "./routes/models";

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ success: false, error: "File size exceeds limit" });
    }
  }

  return res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/textures", textureRoutes);
app.use("/api/models", modelRoutes);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Minecraft Mod Generator backend listening on port ${PORT}`);
});

export default app;
