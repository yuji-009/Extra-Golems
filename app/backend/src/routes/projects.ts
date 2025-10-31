import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  validateProject,
  checkIdConflicts,
} from "../validators/projectValidator";
import { CodeGenerator } from "../services/codeGenerator";
import { BuildOrchestrator } from "../services/buildOrchestrator";
import type { Project } from "../types/project";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const codeGenerator = new CodeGenerator();
const buildOrchestrator = new BuildOrchestrator();

/**
 * POST /api/projects/validate
 * Validate a project configuration
 */
router.post("/validate", (req: Request, res: Response) => {
  try {
    const projectData: unknown = req.body;

    // Validate project structure
    const validationResult = validateProject(projectData);

    if (!validationResult.valid) {
      return res.status(200).json(validationResult);
    }

    // Check for ID conflicts
    const project = projectData as Project;
    const conflictErrors = checkIdConflicts(project);

    if (conflictErrors.length > 0) {
      return res.status(200).json({
        valid: false,
        errors: conflictErrors,
      });
    }

    return res.status(200).json({
      valid: true,
      errors: [],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Validation failed";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

/**
 * POST /api/projects/generate
 * Generate and compile a complete JAR file
 */
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const projectData: unknown = req.body;

    // Validate project
    const validationResult = validateProject(projectData);
    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        errors: validationResult.errors,
      });
    }

    // Check for conflicts
    const project = projectData as Project;
    const conflictErrors = checkIdConflicts(project);
    if (conflictErrors.length > 0) {
      return res.status(422).json({
        success: false,
        errors: conflictErrors,
      });
    }

    // Generate code
    const files = codeGenerator.generateMod(project);

    // Build JAR
    const buildResult = await buildOrchestrator.queueBuild(
      files,
      project.metadata.modId
    );

    if (!buildResult.success) {
      return res.status(500).json({
        success: false,
        error: buildResult.error,
      });
    }

    // Read JAR file
    if (!buildResult.jarPath || !fs.existsSync(buildResult.jarPath)) {
      return res.status(500).json({
        success: false,
        error: "JAR file not found after build",
      });
    }

    const jarBuffer = fs.readFileSync(buildResult.jarPath);

    // Send JAR file
    res.setHeader("Content-Type", "application/java-archive");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${project.metadata.modId}-${project.metadata.version}.jar"`
    );
    res.send(jarBuffer);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Build failed";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

/**
 * POST /api/projects/import
 * Import a previously exported project file
 */
router.post(
  "/import",
  upload.single("file"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file provided",
        });
      }

      const projectData = JSON.parse(req.file.buffer.toString("utf-8"));

      // Validate project structure
      const validationResult = validateProject(projectData);
      if (!validationResult.valid) {
        return res.status(400).json({
          success: false,
          errors: validationResult.errors,
        });
      }

      return res.json({
        success: true,
        project: projectData,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Import failed";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
);

export default router;
