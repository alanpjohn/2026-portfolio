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
const MANIFEST_FILE = "content-sync-manifest.json";
const R2_MANIFEST_KEY = "metadata/sync-manifest.json";

// Types
interface FileManifest {
  files: Record<
    string,
    {
      hash: string;
      mtime: number;
      size: number;
    }
  >;
  lastSync: number;
}

type SyncMode = "sync" | "build";

function getFileHash(filePath: string): string {
  const content = readFileSync(filePath);
  return createHash("sha256").update(content).digest("hex");
}

function getLocalManifest(): FileManifest {
  const manifestPath = join(CONTENT_DIR, MANIFEST_FILE);
  if (existsSync(manifestPath)) {
    return JSON.parse(readFileSync(manifestPath, "utf-8"));
  }
  return { files: {}, lastSync: 0 };
}

async function getR2Manifest(): Promise<FileManifest> {
  try {
    const result = execSync(
      `bun wrangler r2 object get ${R2_BUCKET}/${R2_MANIFEST_KEY} --pipe`,
      {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    );
    return JSON.parse(result);
  } catch {
    return { files: {}, lastSync: 0 };
  }
}

async function uploadToR2(localPath: string, r2Key: string): Promise<void> {
  console.log(`📤 Uploading ${localPath} → ${r2Key}`);
  execSync(
    `bun wrangler r2 object put ${R2_BUCKET}/${r2Key} --file=${localPath} --remote`,
    {
      stdio: "inherit",
    },
  );
}

async function downloadFromR2(r2Key: string, localPath: string): Promise<void> {
  console.log(`📥 Downloading ${r2Key} → ${localPath}`);
  const dir = dirname(localPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  execSync(
    `bun wrangler r2 object get ${R2_BUCKET}/${r2Key} --pipe > "${localPath}"`,
    {
      stdio: "inherit",
    },
  );
}

async function syncFile(
  localPath: string,
  r2Key: string,
  localInfo: { hash: string; mtime: number; size: number },
  remoteInfo: { hash: string; mtime: number; size: number } | undefined,
  mode: SyncMode,
): Promise<"upload" | "download" | "skip"> {
  const localExists = existsSync(localPath);
  const remoteExists = !!remoteInfo;

  if (!localExists && !remoteExists) return "skip";
  if (!localExists && remoteExists) {
    await downloadFromR2(r2Key, localPath);
    return "download";
  }
  if (localExists && !remoteExists) {
    if (mode === "sync") {
      await uploadToR2(localPath, r2Key);
      return "upload";
    }
    return "skip";
  }

  // Both exist - compare timestamps and hashes
  const localNewer = localInfo.mtime > remoteInfo!.mtime;
  const remoteNewer = remoteInfo!.mtime > localInfo.mtime;
  const sameTime = localInfo.mtime === remoteInfo!.mtime;
  const sameHash = localInfo.hash === remoteInfo!.hash;

  if (sameHash) return "skip";

  if (localNewer) {
    if (mode === "sync") {
      await uploadToR2(localPath, r2Key);
      return "upload";
    }
    return "skip"; // build mode protects local changes
  }

  if (remoteNewer || sameTime) {
    await downloadFromR2(r2Key, localPath);
    return "download";
  }

  return "skip";
}

async function findContentFiles(): Promise<string[]> {
  const files: string[] = [];

  function scanDir(dir: string, prefix = "") {
    const entries = execSync(
      `find "${dir}" -type f -not -name "${MANIFEST_FILE}"`,
      {
        encoding: "utf-8",
      },
    )
      .split("\n")
      .filter(Boolean);

    for (const entry of entries) {
      const relativePath = entry.replace(`${dir}/`, "");
      files.push(relativePath);
    }
  }

  if (existsSync(CONTENT_DIR)) {
    scanDir(CONTENT_DIR);
  }

  return files;
}

async function syncContent(mode: SyncMode): Promise<void> {
  console.log(`🔄 Starting content sync in ${mode} mode...`);

  // Get local and remote manifests
  const localManifest = getLocalManifest();
  const remoteManifest = await getR2Manifest();

  // Find all content files
  const contentFiles = await findContentFiles();

  // Build current local file info
  const currentLocalFiles: Record<
    string,
    { hash: string; mtime: number; size: number }
  > = {};

  for (const file of contentFiles) {
    const localPath = join(CONTENT_DIR, file);
    if (existsSync(localPath)) {
      const stats = statSync(localPath);
      currentLocalFiles[file] = {
        hash: getFileHash(localPath),
        mtime: stats.mtime.getTime(),
        size: stats.size,
      };
    }
  }

  // Sync each file (eliminate duplicates)
  const actions: string[] = [];
  const allFiles = new Set([
    ...contentFiles,
    ...Object.keys(remoteManifest.files),
  ]);

  console.log(
    `📁 Found ${contentFiles.length} local files, ${Object.keys(remoteManifest.files).length} remote files`,
  );

  for (const file of allFiles) {
    const localPath = join(CONTENT_DIR, file);
    const r2Key = `content/${file}`;
    const localInfo = currentLocalFiles[file];
    const remoteInfo = remoteManifest.files[file];

    const action = await syncFile(
      localPath,
      r2Key,
      localInfo,
      remoteInfo,
      mode,
    );
    if (action !== "skip") {
      actions.push(`${action.toUpperCase()}: ${file}`);
    }
  }

  // Only update manifests if there were changes
  if (actions.length > 0) {
    const newManifest: FileManifest = {
      files: currentLocalFiles,
      lastSync: Date.now(),
    };

    // Write local manifest
    writeFileSync(join(CONTENT_DIR, MANIFEST_FILE), JSON.stringify(newManifest, null, 2));

    // Upload manifest to R2
    const manifestPath = join(CONTENT_DIR, MANIFEST_FILE);
    await uploadToR2(manifestPath, R2_MANIFEST_KEY);
  }

  // Report results
  console.log(`✅ Sync complete!`);
  if (actions.length > 0) {
    console.log("\n📋 Changes:");
    actions.forEach((action) => console.log(`  ${action}`));
  } else {
    console.log("📋 No changes detected.");
  }
}

async function main() {
  const mode = process.argv[2] as SyncMode;

  if (!mode || !["sync", "build"].includes(mode)) {
    console.error("Usage: tsx scripts/sync-content.ts <sync|build>");
    console.error("  sync: Two-way sync for development");
    console.error(
      "  build: Conservative sync for deployment (protects local changes)",
    );
    process.exit(1);
  }

  try {
    await syncContent(mode);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
