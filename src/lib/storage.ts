import fs from "fs";
import os from "os";
import path from "path";

let cachedDataRoot: string | null = null;

function isWritableDir(dirPath: string): boolean {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    const probe = path.join(dirPath, `.write-test-${process.pid}`);
    fs.writeFileSync(probe, "ok");
    fs.unlinkSync(probe);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolves a guaranteed-writable storage root directory for the portal DB
 * and runtime file uploads (PDFs, flowcharts, images).
 *
 * Priority:
 * 1. INGEULA_DATA_DIR env var (if configured for a mounted volume)
 * 2. <cwd>/data (standard local development / VPS)
 * 3. <os.tmpdir()>/ingeula-data (read-only container / serverless fallback)
 */
export function getStorageRoot(): string {
  if (cachedDataRoot) {
    return cachedDataRoot;
  }

  const candidates = [
    process.env.INGEULA_DATA_DIR,
    path.join(process.cwd(), "data"),
    path.join(os.tmpdir(), "ingeula-data"),
  ].filter((p): p is string => Boolean(p && p.trim()));

  for (const candidate of candidates) {
    if (isWritableDir(candidate)) {
      cachedDataRoot = candidate;
      return candidate;
    }
  }

  // Last resort: os.tmpdir() directly
  const fallback = path.join(os.tmpdir(), "ingeula-data");
  fs.mkdirSync(fallback, { recursive: true });
  cachedDataRoot = fallback;
  return fallback;
}

export function getUploadsRoot(): string {
  const uploadsRoot = path.join(getStorageRoot(), "uploads");
  fs.mkdirSync(uploadsRoot, { recursive: true });
  return uploadsRoot;
}
