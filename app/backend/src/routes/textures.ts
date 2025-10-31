import { Router, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/textures/upload
 * Upload a texture file
 */
router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }

    // Validate file is PNG
    if (req.file.mimetype !== "image/png") {
      return res.status(400).json({
        success: false,
        error: "File must be PNG format",
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: "File size exceeds 5MB limit",
      });
    }

    // Process image with sharp
    const metadata = await sharp(req.file.buffer).metadata();

    // Optionally resize if > 512px
    let processedBuffer = req.file.buffer;
    if (
      metadata.width &&
      metadata.height &&
      (metadata.width > 512 || metadata.height > 512)
    ) {
      processedBuffer = await sharp(req.file.buffer)
        .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    }

    // Calculate checksum
    const checksum = crypto
      .createHash("sha256")
      .update(processedBuffer)
      .digest("hex");

    // Convert to base64
    const base64Data = processedBuffer.toString("base64");
    const textureUrl = `data:image/png;base64,${base64Data}`;

    res.json({
      success: true,
      textureUrl,
      size: `${metadata.width}x${metadata.height}`,
      checksum,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    res.status(400).json({
      success: false,
      error: message,
    });
  }
});

/**
 * POST /api/textures/generate
 * AI-generate a texture from text prompt
 * (Placeholder - would integrate with DALL-E or similar)
 */
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { prompt, size = 256 } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    if (prompt.length < 5) {
      return res.status(400).json({
        success: false,
        error: "Prompt must be at least 5 characters",
      });
    }

    // TODO: Implement actual AI texture generation
    // This would call DALL-E or Midjourney API
    // For now, return placeholder

    return res.status(503).json({
      success: false,
      error: "AI texture generation not yet implemented",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

export default router;
