import { defineConfig, s } from "velite";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightCodeLines from "rehype-highlight-code-lines";
import { rehypeImageOptimization } from "./src/lib/content/rehype-images";
import { rehypeTableWrapper } from "./src/lib/content/rehype-tables";
import { execSync } from "child_process";
import {
  generateBlogOGImage,
  generateDefaultOGImage,
} from "@/lib/seo/og-images";

// Pre-hook to ensure content exists before velite runs
function ensureContentPreHook() {
  console.log("🔄 Ensuring content exists before velite build...");

  try {
    execSync(`bunx tsx scripts/sync-content.ts ensure`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("✅ Content ready for velite");
  } catch (error) {
    console.error("❌ Content ensure failed:", error);
    process.exit(1);
  }
}

export default defineConfig({
  collections: {
    blog: {
      name: "BlogPost",
      pattern: "blog/*.md",
      schema: s.object({
        title: s.string().max(200),
        date: s.string().transform((date) => new Date(date)),
        tags: s.array(s.string()).max(10),
        excerpt: s.string().max(300),
        publish: s.boolean().default(false),
        slug: s
          .path()
          .transform((path) =>
            path.replace(/^blog\//, "").replace(/\.md$/, ""),
          ),
        content: s.markdown({
          rehypePlugins: [
            [
              rehypeHighlight,
              {
                detect: true,
                ignoreMissing: true,
              },
              rehypeHighlightCodeLines,
            ],
            rehypeTableWrapper,
            rehypeImageOptimization,
          ],
        }),
      }),
    },
    work: {
      name: "WorkContent",
      pattern: "work.yaml",
      schema: s.object({
        items: s.array(
          s.object({
            id: s.string(),
            title: s.string(),
            type: s.enum(["project", "experience"]),
            description: s.string(),
            tags: s.array(s.string()),
            featured: s.boolean().default(false),
            url: s.string().optional(),
            image: s.string().optional(),
            date: s.string().transform((date) => new Date(date)),
            endDate: s
              .string()
              .optional()
              .transform((date) => (date ? new Date(date) : undefined)),
            company: s.string().optional(),
            role: s.string().optional(),
          }),
        ),
      }),
    },
  },
  prepare: ensureContentPreHook,
  complete: async (data) => {
    await generateDefaultOGImage();
    for (const post of data.blog) {
      await generateBlogOGImage(post);
    }
  },
});
