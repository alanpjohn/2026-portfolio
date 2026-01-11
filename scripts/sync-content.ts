#!/usr/bin/env tsx

import { execSync } from "child_process";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  statSync,
} from "fs";
import { join, dirname } from "path";
import { createHash } from "crypto";

// Configuration
const CONTENT_DIR = "content";
const R2_BUCKET = "portfolio-assets";
const R2_MANIFEST_KEY = "metadata/manifest.json";

// Types
interface FileMetadata {
  hash: string;
  mtime: number;
  size: number;
}

interface RemoteManifest {
  files: Record<string, FileMetadata>;
  lastBackup: number;
}

function getFileHash(filePath: string): string {
  const content = readFileSync(filePath);
  return createHash("md5").update(content).digest("hex");
}

function findContentFiles(): string[] {
  const files: string[] = [];

  if (!existsSync(CONTENT_DIR)) {
    return files;
  }

  const entries = execSync(
    `find "${CONTENT_DIR}" -type f`,
    {
      encoding: "utf-8",
    },
  )
    .split("\n")
    .filter(Boolean);

  for (const entry of entries) {
    const relativePath = entry.replace(`${CONTENT_DIR}/`, "");
    files.push(relativePath);
  }

  return files;
}

async function getRemoteManifest(): Promise<RemoteManifest | null> {
  try {
    const result = execSync(
      `bun wrangler r2 object get ${R2_BUCKET}/${R2_MANIFEST_KEY} --pipe --remote`,
      {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    );
    return JSON.parse(result);
  } catch {
    return null;
  }
}

async function uploadFile(localPath: string, r2Key: string): Promise<void> {
  execSync(
    `cat "${localPath}" | bun wrangler r2 object put ${R2_BUCKET}/${r2Key} --pipe --remote`,
    {
      stdio: "inherit",
    },
  );
}

async function downloadFile(r2Key: string, localPath: string): Promise<void> {
  const dir = dirname(localPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  execSync(
    `bun wrangler r2 object get ${R2_BUCKET}/${r2Key} --pipe --remote > "${localPath}"`,
    {
      stdio: "inherit",
    },
  );
}

async function deleteFile(r2Key: string): Promise<void> {
  execSync(
    `bun wrangler r2 object delete ${R2_BUCKET}/${r2Key} --remote`,
    {
      stdio: "inherit",
    },
  );
}

function buildManifest(files: string[]): RemoteManifest {
  const manifestFiles: Record<string, FileMetadata> = {};

  for (const file of files) {
    const localPath = join(CONTENT_DIR, file);
    if (existsSync(localPath)) {
      const stats = statSync(localPath);
      manifestFiles[file] = {
        hash: getFileHash(localPath),
        mtime: stats.mtime.getTime(),
        size: stats.size,
      };
    }
  }

  return {
    files: manifestFiles,
    lastBackup: Date.now(),
  };
}

async function uploadManifest(manifest: RemoteManifest): Promise<void> {
  const tempManifestPath = "/tmp/manifest.json";
  writeFileSync(tempManifestPath, JSON.stringify(manifest, null, 2));
  await uploadFile(tempManifestPath, R2_MANIFEST_KEY);
}

// High-level operations
async function backup(): Promise<void> {
  console.log("🔄 Backing up local content to R2...");

  const localFiles = findContentFiles();
  const remoteManifest = await getRemoteManifest();
  const remoteFiles = remoteManifest ? Object.keys(remoteManifest.files) : [];

  if (localFiles.length === 0) {
    console.log("⚠️  No content files found to backup");
    return;
  }

  // Delete orphaned files from R2 (files in R2 but not in local)
  for (const remoteFile of remoteFiles) {
    if (!localFiles.includes(remoteFile)) {
      try {
        const r2Key = `content/${remoteFile}`;
        console.log(`🗑️ Deleting ${remoteFile} from R2`);
        await deleteFile(r2Key);
      } catch (error) {
        console.warn(`⚠️  Failed to delete ${remoteFile}:`, error);
        // Continue with other files
      }
    }
  }

  // Upload new/modified local files
  for (const file of localFiles) {
    try {
      const localPath = join(CONTENT_DIR, file);
      const r2Key = `content/${file}`;
      console.log(`📤 Uploading ${file}`);
      await uploadFile(localPath, r2Key);
    } catch (error) {
      console.warn(`⚠️  Failed to upload ${file}:`, error);
      // Continue with other files
    }
  }

  // Upload manifest
  try {
    const manifest = buildManifest(localFiles);
    await uploadManifest(manifest);
    console.log("📝 Manifest uploaded");
  } catch (error) {
    console.warn("⚠️  Failed to upload manifest:", error);
    // Don't fail the entire backup
  }

  console.log("✅ Backup complete");
}

async function restore(): Promise<void> {
  console.log("🔄 Restoring missing content from R2...");

  const remoteManifest = await getRemoteManifest();

  if (!remoteManifest) {
    console.log("⚠️  No remote manifest found - nothing to restore");
    return;
  }

  let restoredCount = 0;

  // Check each remote file
  for (const [file, metadata] of Object.entries(remoteManifest.files)) {
    const localPath = join(CONTENT_DIR, file);

    if (!existsSync(localPath)) {
      try {
        const r2Key = `content/${file}`;
        console.log(`📥 Restoring ${file}`);
        await downloadFile(r2Key, localPath);
        restoredCount++;
      } catch (error) {
        console.warn(`⚠️  Failed to restore ${file}:`, error);
        // Continue with other files
      }
    }
  }

  if (restoredCount === 0) {
    console.log("📋 No files needed restoration");
  } else {
    console.log(`📋 Restored ${restoredCount} files`);
  }

  console.log("✅ Restore complete");
}

async function ensure(): Promise<void> {
  console.log("🔄 Checking content directory...");

  const remoteManifest = await getRemoteManifest();

  if (!remoteManifest) {
    console.log("⚠️  No remote manifest found - skipping content check");
    return;
  }

  const localFiles = findContentFiles();

  if (localFiles.length === 0) {
    console.log("📂 Content directory empty - restoring from R2...");
    await restore();
  } else {
    // Check for differences with remote manifest
    const remoteFiles = Object.keys(remoteManifest.files);
    const localSet = new Set(localFiles);
    const remoteSet = new Set(remoteFiles);

    const missingLocally = remoteFiles.filter(f => !localSet.has(f));
    const extraLocally = localFiles.filter(f => !remoteSet.has(f));

    if (missingLocally.length > 0 || extraLocally.length > 0) {
      console.warn("⚠️  Content directory differs from backup:");
      if (missingLocally.length > 0) {
        console.warn(`   Missing locally: ${missingLocally.join(', ')}`);
      }
      if (extraLocally.length > 0) {
        console.warn(`   Extra locally: ${extraLocally.join(', ')}`);
      }
      console.warn("ℹ️  Run 'bun run content:backup' to sync changes to R2");
    } else {
      console.log("✅ Content directory matches backup");
    }
  }
}



async function main() {
  const command = process.argv[2];

  if (!command || !["backup", "restore", "ensure"].includes(command)) {
    console.error("Usage: tsx scripts/sync-content.ts <backup|restore|ensure>");
    console.error("  backup: Sync local content to R2 (removes deleted files)");
    console.error("  restore: Download missing files from R2");
    console.error("  ensure: Check content directory and warn about differences");
    process.exit(1);
  }

  try {
    switch (command) {
      case "backup":
        await backup();
        break;
      case "restore":
        await restore();
        break;
      case "ensure":
        await ensure();
        break;
    }
  } catch (error) {
    console.error("❌ Operation failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}