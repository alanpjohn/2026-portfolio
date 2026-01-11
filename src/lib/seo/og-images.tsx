import React from "react";
import { BlogPost } from "velite-content";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { formatDate } from "@/lib/utils/helpers";
import { siteConfig } from "@/data/config";

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
    const clashDisplayFont = readFileSync(join(fontDir, "ClashDisplay-Semibold.otf"));

    // Load Archivo Regular OTF (for body text)
    const archivoFont = readFileSync(join(fontDir, "Archivo-Regular.otf"));

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
        justifyContent: "center", // Center content vertically
        width: "1200px",
        height: "630px",
        backgroundColor: "#0d0e10",
        padding: "60px",
        color: "#f0ede6",
        fontFamily: "Archivo",
      }}
    >
      {/* Main content - left aligned */}
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "1000px" }}>
        {/* Title - Large Clash Display */}
        <h1
          style={{
            fontFamily: "Clash Display",
            fontSize: title.length > 40 ? "56px" : "64px",
            fontWeight: 600, // Semibold
            lineHeight: 1.1,
            marginBottom: isBlogPost ? "16px" : "24px",
          }}
        >
          {title}
        </h1>

        {/* Excerpt for blog posts */}
        {isBlogPost && description && (
          <p
            style={{
              fontSize: "24px",
              lineHeight: 1.4,
              color: "rgba(240, 237, 230, 0.9)",
              fontWeight: 400,
              marginBottom: "24px",
              maxWidth: "800px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        )}

        {/* Date and tags row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: "20px",
              color: "rgba(240, 237, 230, 0.7)",
              fontWeight: 500,
            }}
          >
            {date}
          </span>

          {/* Tags */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  backgroundColor: "#2cb67d",
                  color: "#0d0e10",
                  fontSize: "18px",
                  fontWeight: 500,
                  padding: "4px 10px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  display: "block",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - AJ on the right */}
      <div style={{ position: "absolute", bottom: "40px", right: "60px", display: "flex" }}>
        <span
          style={{
            fontFamily: "Clash Display",
            fontSize: "32px",
            fontWeight: 600,
            color: "#f0ede6", // Same as foreground text
          }}
        >
          AJ
        </span>
      </div>
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
    }
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
}

// This function generates the default OG image used for non-blog pages using
// Satori and ReSVG and saved as default.png in the public/static directory
export async function generateDefaultOGImage() {
  const fonts = await loadFonts();
  const ogDir = join(process.cwd(), "public", "static", "og");

  // Ensure directory exists
  mkdirSync(ogDir, { recursive: true });

  // Default content
  const defaultProps: OGCardProps = {
    title: "Alan John",
    description: "developer portfolio & blog",
    tags: ["Portfolio", "Blog", "Work"],
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
}
