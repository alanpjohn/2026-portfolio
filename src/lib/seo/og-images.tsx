import React from "react";
import { BlogPost } from "velite-content";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import crypto from "crypto";
import { formatDate } from "@/lib/utils/helpers";
import { siteConfig } from "@/data/config";

const OG_CACHE_FILE = '.cache/og-generation.json'

interface OGCacheEntry {
  mtime: number
  hash: string
}

interface OGCache {
  [slug: string]: OGCacheEntry
}

function loadOGCache(): OGCache {
  try {
    if (existsSync(OG_CACHE_FILE)) {
      return JSON.parse(readFileSync(OG_CACHE_FILE, 'utf-8'))
    }
  } catch (error) {
    console.warn('Failed to load OG cache:', error)
  }
  return {}
}

function saveOGCache(cache: OGCache) {
  try {
    mkdirSync(join(process.cwd(), '.cache'), { recursive: true })
    writeFileSync(OG_CACHE_FILE, JSON.stringify(cache, null, 2))
  } catch (error) {
    console.warn('Failed to save OG cache:', error)
  }
}

function getContentHash(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex')
}

// All the modifiable data in the OG Image
type OGCardProps = {
  title: string;
  description: string;
  tags: string[];
  date: string;
};

// Load fonts for Satori from local OTF files (single style, non-variable)
async function loadFonts() {
  const fontDir = join(process.cwd(), "public", "assets", "fonts");

  try {
    // Load Clash Display Semibold OTF (for headings)
    const clashDisplayFont = readFileSync(
      join(fontDir, "ClashDisplay-Semibold.otf"),
    );

    // Load Archivo Regular OTF (for body text)
    const archivoFont = readFileSync(join(fontDir, "Archivo-Regular.otf"));

    // Load Nippo Regular OTF (for logo)
    const nippoFont = readFileSync(join(fontDir, "Nippo-Regular.otf"));

    return [
      {
        name: "Clash Display",
        data: clashDisplayFont,
        weight: 600 as const, // Semibold
        style: "normal" as const,
      },
      {
        name: "Archivo",
        data: archivoFont,
        weight: 400 as const, // Regular
        style: "normal" as const,
      },
      {
        name: "Nippo",
        data: nippoFont,
        weight: 400 as const, // Regular
        style: "normal" as const,
      },
    ];
  } catch (error) {
    console.warn("⚠️ Font loading failed:", error);
    // Provide minimal fallback fonts
    return [
      {
        name: "system-ui",
        data: Buffer.alloc(1024, 0),
        weight: 400 as const,
        style: "normal" as const,
      },
    ];
  }
}

// Create a template for all OG images (default and blog pages)
// This template is reused with different content to give a consistent
// but modular style to all the cards.
function OGCard({ title, description, tags, date }: OGCardProps) {
  const isBlogPost = description && description !== siteConfig.description;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "1200px",
        height: "630px",
        backgroundColor: "#0d0e10",
        padding: "60px",
        color: "#f0ede6",
        fontFamily: "Archivo",
        border: "16px solid #0A0A0A",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Brutalist border frame */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          bottom: "20px",
          border: "6px solid #f0ede6",
          pointerEvents: "none",
        }}
      />
      
      {/* Main content - render AFTER decorative elements so it appears on top */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "900px",
          ...(isBlogPost ? {} : { alignItems: "center", textAlign: "center" })
        }}
      >
        {/* Date badge for blog posts */}
        {isBlogPost && (
          <div
            style={{
              display: "flex",
              backgroundColor: "#2cb67d",
              color: "#0d0e10",
              padding: "8px 16px",
              fontFamily: "Archivo",
              fontSize: "18px",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: "20px",
              alignSelf: isBlogPost ? "flex-start" : "center",
            }}
          >
            {date}
          </div>
        )}

        {/* Title - Large Clash Display */}
        <h1
          style={{
            fontFamily: "Clash Display",
            fontSize: title.length > 40 ? "52px" : "60px",
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: isBlogPost ? "20px" : "24px",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>

        {/* Excerpt for blog posts */}
        {isBlogPost && description && (
          <p
            style={{
              fontSize: "22px",
              lineHeight: 1.4,
              color: "rgba(240, 237, 230, 0.85)",
              fontWeight: 400,
              marginBottom: "28px",
              maxWidth: "750px",
              maxHeight: "66px",
              overflow: "hidden",
            }}
          >
            {description.length > 120 ? description.slice(0, 120) + "..." : description}
          </p>
        )}

        {/* Tags */}
        <div style={{ 
          display: "flex", 
          gap: "10px", 
          flexWrap: "wrap",
          ...(isBlogPost ? {} : { justifyContent: "center" })
        }}>
          {tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: "#2cb67d",
                color: "#0d0e10",
                fontSize: "16px",
                fontWeight: 600,
                padding: "6px 12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: "block",
                fontFamily: "Archivo",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer - AJ logo with bracket style - render AFTER main content */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "60px",
          display: "flex",
        }}
      >
        <span
          style={{
            fontFamily: "Nippo",
            fontSize: "36px",
            fontWeight: 400,
            color: "#f0ede6",
            backgroundColor: "#0d0e10",
            padding: "4px 12px",
            border: "3px solid #f0ede6",
          }}
        >
          [ AJ ]
        </span>
      </div>

      {/* Left side decoration line */}
      <div
        style={{
          position: "absolute",
          left: "40px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "4px",
          height: "200px",
          backgroundColor: "#2cb67d",
        }}
      />
    </div>
  );
}

// This function creates an OG image React HTML
// Uses Satori to convert it into SVG and then ReSVG to convert to png
// and saves it to public/static directory as <slug>.png
export async function generateBlogOGImage({
  slug,
  title,
  excerpt,
  date,
  tags,
}: BlogPost) {
  const contentString = `${title}|${excerpt}|${date.toISOString()}|${tags.join(',')}`
  const contentHash = getContentHash(contentString)

  const cache = loadOGCache()
  const cached = cache[slug]

  if (cached && cached.hash === contentHash) {
    console.log(`Skipping OG image for ${slug} (unchanged)`)
    return
  }

  const fonts = await loadFonts();
  const ogDir = join(process.cwd(), "public", "static", "og");

  // Ensure directory exists
  mkdirSync(ogDir, { recursive: true });

  // Format date for display
  const formattedDate = formatDate(date);

  // Generate SVG using Satori
  const svg = await satori(
    <OGCard
      title={title}
      description={excerpt}
      tags={tags}
      date={formattedDate}
    />,
    {
      width: 1200,
      height: 630,
      fonts,
    },
  );

  console.log(`✅ Generated SVG for ${slug}`);

  // Convert to PNG using Resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // Save PNG file
  const outputPath = join(ogDir, `${slug}.png`);
  writeFileSync(outputPath, pngBuffer);

  console.log(`✅ Generated OG image: ${slug}.png`);

  // Update cache
  cache[slug] = { mtime: Date.now(), hash: contentHash }
  saveOGCache(cache)
}

// This function generates the default OG image used for non-blog pages using
// Satori and ReSVG and saved as default.png in the public/static directory
export async function generateDefaultOGImage() {
  const contentString = `Alan John|Developer portfolio & blog|Backend,Cloud,Linux,AI`
  const contentHash = getContentHash(contentString)

  const cache = loadOGCache()
  const slug = 'default'
  const cached = cache[slug]

  if (cached && cached.hash === contentHash) {
    console.log(`Skipping default OG image (unchanged)`)
    return
  }

  const fonts = await loadFonts();
  const ogDir = join(process.cwd(), "public", "static", "og");

  // Ensure directory exists
  mkdirSync(ogDir, { recursive: true });

  // Default content
  const defaultProps: OGCardProps = {
    title: "Alan John",
    description: "Developer portfolio & blog",
    tags: ["Backend", "Cloud", "Linux", "AI"],
    date: formatDate(new Date()),
  };

  // Generate SVG using Satori
  const svg = await satori(<OGCard {...defaultProps} />, {
    width: 1200,
    height: 630,
    fonts,
  });

  // Convert to PNG using Resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // Save PNG file
  const outputPath = join(ogDir, "default.png");
  writeFileSync(outputPath, pngBuffer);

  console.log(`✅ Generated default OG image: default.png`);

  // Update cache
  cache[slug] = { mtime: Date.now(), hash: contentHash }
  saveOGCache(cache)
}
