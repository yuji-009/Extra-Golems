import axios from "axios";
import type { Project, ValidationResult } from "../types/project";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000, // 10 minutes for builds
});

/**
 * Validate a project
 */
export async function validateProject(project: Project): Promise<ValidationResult> {
  const response = await client.post("/projects/validate", project);
  return response.data;
}

/**
 * Generate and download a JAR file
 */
export async function generateProject(project: Project): Promise<Blob> {
  const response = await client.post("/projects/generate", project, {
    responseType: "blob",
  });
  return response.data;
}

/**
 * Import a project from file
 */
export async function importProject(file: File): Promise<Project> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await client.post("/projects/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.project;
}

/**
 * Upload a texture
 */
export async function uploadTexture(
  file: File
): Promise<{ textureUrl: string; size: string; checksum: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await client.post("/textures/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Generate AI texture
 */
export async function generateTexture(
  prompt: string,
  size?: number
): Promise<{ textureUrl: string }> {
  const response = await client.post("/textures/generate", {
    prompt,
    size: size || 256,
  });
  return response.data;
}

/**
 * Upload a model file
 */
export async function uploadModel(
  file: File
): Promise<{ modelUrl: string; bones: number; preview: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await client.post("/models/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Parse and validate model JSON
 */
export async function parseModelJson(
  modelJson: Record<string, unknown>
): Promise<{ valid: boolean; bones: number; textures: string[] }> {
  const response = await client.post("/models/parse-json", { modelJson });
  return response.data;
}

export default client;
