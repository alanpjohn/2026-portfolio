import fs from "node:fs";
import path from "node:path";

/**
 * Content directory validation environment module.
 *
 * Validates that CONTENT_DIR is set, exists, and has the required structure:
 * - CONTENT_DIR/
 *   - blog/ (subdirectory with at least one .md file)
 *   - work.yaml (file with `items` array)
 *
 * @example
 * ```bash
 * # In .env
 * CONTENT_DIR=./content
 * # or
 * CONTENT_DIR=/home/user/my-portfolio/content
 * ```
 */

interface WorkYaml {
  items?: unknown[];
}

/**
 * Error class for content directory validation failures.
 */
export class ContentDirError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ContentDirError";
  }
}

/**
 * Checks if a path is absolute.
 * - Unix: starts with /
 * - Windows: starts with drive letter (C:\, D:\, etc.)
 */
function isAbsolutePath(inputPath: string): boolean {
  // Unix absolute path
  if (inputPath.startsWith("/")) {
    return true;
  }
  // Windows absolute path (e.g., C:\, D:\)
  if (/^[A-Za-z]:[/\\]/.test(inputPath)) {
    return true;
  }
  return false;
}

/**
 * Gets the absolute path for CONTENT_DIR.
 * - Absolute paths are used as-is
 * - Relative paths are resolved from process.cwd()
 */
function resolveContentDir(envValue: string): string {
  if (isAbsolutePath(envValue)) {
    return path.normalize(envValue);
  }
  return path.resolve(process.cwd(), envValue);
}

/**
 * Validates that CONTENT_DIR environment variable is set.
 */
function getContentDirFromEnv(): string {
  const contentDir = process.env.CONTENT_DIR;

  if (!contentDir || contentDir.trim() === "") {
    throw new ContentDirError(` CONTENT_DIR environment variable is not set.

This variable is required and has no default value.

To fix this:
1. Copy .env.example to .env:
   cp .env.example .env

2. Edit .env and set CONTENT_DIR to your content directory path

3. Example paths:
   - Relative: ./content, ../my-content, content
   - Absolute: /home/user/content, /path/to/content

4. See .env.example for full documentation.`);
  }

  return contentDir.trim();
}

/**
 * Validates that the content directory exists.
 */
function validateDirectoryExists(absolutePath: string): void {
  if (!fs.existsSync(absolutePath)) {
    throw new ContentDirError(`Content directory does not exist: ${absolutePath}

To fix this:
1. Verify the path is correct in your .env file
2. Create the directory with the required structure:
   - blog/ subdirectory with .md files
   - work.yaml file
3. Or copy from content-example:
   cp -r content-example content
   CONTENT_DIR=./content bun run velite

See .env.example for the expected directory structure.`);
  }

  const stats = fs.statSync(absolutePath);
  if (!stats.isDirectory()) {
    throw new ContentDirError(`Content path is not a directory: ${absolutePath}

To fix this:
1. Verify CONTENT_DIR points to a directory, not a file
2. Update the path in your .env file`);
  }
}

/**
 * Validates that the blog subdirectory exists.
 */
function validateBlogDirExists(absolutePath: string): void {
  const blogDir = path.join(absolutePath, "blog");

  if (!fs.existsSync(blogDir)) {
    throw new ContentDirError(`Blog directory does not exist: ${blogDir}

To fix this:
1. Create the blog subdirectory in your content directory:
   mkdir -p "${blogDir}"

2. Add at least one .md file:
   echo '# My First Post' > "${blogDir}/first-post.md"

3. See content-example/blog/ for reference structure`);
  }

  if (!fs.statSync(blogDir).isDirectory()) {
    throw new ContentDirError(`Blog path is not a directory: ${blogDir}

To fix this:
1. Rename any file named 'blog' to something else
2. Create a blog/ directory for your markdown files`);
  }
}

/**
 * Validates that the blog directory contains at least one .md file.
 */
function validateBlogHasContent(absolutePath: string): void {
  const blogDir = path.join(absolutePath, "blog");

  const files = fs.readdirSync(blogDir);
  const mdFiles = files.filter((file) => file.endsWith(".md"));

  if (mdFiles.length === 0) {
    throw new ContentDirError(`Blog directory has no .md files: ${blogDir}

To fix this:
1. Add at least one markdown file to the blog directory:
   echo '# My First Post' > "${blogDir}/first-post.md"

2. Example blog post structure:
   ---
   title: "My First Post"
   date: 2024-01-15
   tags: ["example"]
   excerpt: "A brief description..."
   ---

   # My First Post

   Content here...

3. See content-example/blog/ for reference files`);
  }
}

/**
 * Validates that work.yaml exists.
 */
function validateWorkYamlExists(absolutePath: string): void {
  const workYamlPath = path.join(absolutePath, "work.yaml");

  if (!fs.existsSync(workYamlPath)) {
    throw new ContentDirError(`work.yaml file does not exist: ${workYamlPath}

To fix this:
1. Create work.yaml in your content directory:
   touch "${workYamlPath}"

2. Add the required structure:
   items:
     - id: "my-project"
       title: "My Project"
       type: "project"
       description: "A brief description..."
       tags: ["example"]
       date: "2024-01-15"

3. See content-example/work.yaml for a complete example`);
  }

  if (!fs.statSync(workYamlPath).isFile()) {
    throw new ContentDirError(`work.yaml is not a file: ${workYamlPath}

To fix this:
1. Rename any directory named 'work.yaml' to something else
2. Create a work.yaml file for your work items`);
  }
}

/**
 * Validates that work.yaml has an `items` array.
 * Uses simple parsing to check for the items key.
 */
function validateWorkYamlStructure(absolutePath: string): void {
  const workYamlPath = path.join(absolutePath, "work.yaml");

  try {
    const content = fs.readFileSync(workYamlPath, "utf-8");

    // Simple check for 'items:' key at the start of a line or after indentation
    // This is a basic validation - full YAML parsing would require js-yaml
    const hasItemsKey = /^items:\s*$/m.test(content) || /^\s+items:\s*$/m.test(content);

    if (!hasItemsKey) {
      throw new ContentDirError(`work.yaml does not contain 'items' key: ${workYamlPath}

Your work.yaml must have the following structure:

items:
  - id: "my-project"
    title: "My Project"
    type: "project"
    description: "A brief description..."
    tags: ["example"]
    date: "2024-01-15"

To fix this:
1. Add 'items:' key to your work.yaml
2. Ensure items is an array of work objects
3. See content-example/work.yaml for a complete example`);
    }
  } catch (error) {
    if (error instanceof ContentDirError) {
      throw error;
    }
    throw new ContentDirError(`Failed to read work.yaml: ${workYamlPath}

Error: ${error instanceof Error ? error.message : String(error)}

To fix this:
1. Verify work.yaml is valid and readable
2. Check file permissions
3. See content-example/work.yaml for the expected format`);
  }
}

// Cached content directory path (validated once)
let cachedContentDir: string | null = null;

/**
 * Gets the validated content directory path.
 *
 * On first call, validates all requirements:
 * - CONTENT_DIR is set in environment
 * - Directory exists and is accessible
 * - blog/ subdirectory exists with .md files
 * - work.yaml exists with 'items' key
 *
 * @returns The validated absolute path to the content directory
 * @throws {ContentDirError} If validation fails
 */
export function getContentDir(): string {
  if (cachedContentDir !== null) {
    return cachedContentDir;
  }

  // Step 1: Get CONTENT_DIR from environment
  const envValue = getContentDirFromEnv();

  // Step 2: Resolve to absolute path
  const absolutePath = resolveContentDir(envValue);

  // Step 3: Validate directory exists
  validateDirectoryExists(absolutePath);

  // Step 4: Validate content structure
  validateBlogDirExists(absolutePath);
  validateBlogHasContent(absolutePath);
  validateWorkYamlExists(absolutePath);
  validateWorkYamlStructure(absolutePath);

  // Cache the validated path
  cachedContentDir = absolutePath;

  return absolutePath;
}

/**
 * Gets the blog directory path.
 * Convenience helper that joins 'blog' to the content directory.
 *
 * @returns The absolute path to the blog directory
 * @throws {ContentDirError} If content directory validation fails
 */
export function getBlogDir(): string {
  return path.join(getContentDir(), "blog");
}

/**
 * Gets the work.yaml file path.
 * Convenience helper that joins 'work.yaml' to the content directory.
 *
 * @returns The absolute path to work.yaml
 * @throws {ContentDirError} If content directory validation fails
 */
export function getWorkYamlPath(): string {
  return path.join(getContentDir(), "work.yaml");
}
