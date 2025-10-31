import { Router, Request, Response } from "express";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/models/upload
 * Upload a Blockbench model (.bbmodel)
 */
router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file provided",
        });
      }

      // Validate file is .bbmodel
      if (!req.file.originalname.endsWith(".bbmodel")) {
        return res.status(400).json({
          success: false,
          error: "File must be .bbmodel format",
        });
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,
          error: "File size exceeds 10MB limit",
        });
      }

      // Parse as JSON
      let modelData: Record<string, unknown>;
      try {
        modelData = JSON.parse(req.file.buffer.toString("utf-8"));
      } catch {
        return res.status(400).json({
          success: false,
          error: "Invalid Blockbench format",
        });
      }

      // Extract bones count
      const bones = Array.isArray(modelData.elements)
        ? modelData.elements.length
        : 0;

      // Convert to base64 for preview (thumbnail)
      const preview = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;

      // Store model JSON as base64
      const modelJson = JSON.stringify(modelData);
      const modelUrl = `data:application/json;base64,${Buffer.from(modelJson).toString("base64")}`;

      res.json({
        success: true,
        modelUrl,
        bones,
        preview,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
);

/**
 * POST /api/models/parse-json
 * Validate and parse a raw model JSON
 */
router.post("/parse-json", (req: Request, res: Response) => {
  try {
    const { modelJson } = req.body;

    if (!modelJson) {
      return res.status(400).json({
        success: false,
        error: "Model JSON is required",
      });
    }

    // Parse JSON
    let parsedModel: Record<string, unknown>;
    if (typeof modelJson === "string") {
      parsedModel = JSON.parse(modelJson);
    } else {
      parsedModel = modelJson;
    }

    // Extract bones and textures
    const bones = Array.isArray(parsedModel.elements)
      ? parsedModel.elements.length
      : 0;
    const textures = Array.isArray(parsedModel.textures)
      ? parsedModel.textures.map((t: any) => t.name || t)
      : [];

    res.json({
      success: true,
      valid: true,
      bones,
      textures,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Parse failed";
    res.status(400).json({
      success: false,
      valid: false,
      error: message,
    });
  }
});

export default router;
