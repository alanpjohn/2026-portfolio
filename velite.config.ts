import { defineConfig, s } from "velite";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightCodeLines from "rehype-highlight-code-lines";
import { rehypeImageOptimization } from "./src/lib/content/rehype-images";
import { rehypeTableWrapper } from "./src/lib/content/rehype-tables";
import { getContentDir } from "./src/lib/content/env";
import {
  generateBlogOGImage,
  generateDefaultOGImage,
} from "@/lib/seo/og-images";

export default defineConfig({
  root: getContentDir(),
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
            bullets: s.array(s.string()).default([]),
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
  complete: async (data) => {
    await generateDefaultOGImage();
    for (const post of data.blog) {
      await generateBlogOGImage(post);
    }
  },
});
